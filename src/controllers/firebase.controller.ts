import {post, Request, requestBody, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/core';
import {Message} from '../models/message.model';
import * as admin from 'firebase-admin';
import serviceAccount from '../credentials/ub-loopback-21d702568ef8.json';
import Messages from '../database/models/messageLog';
import UserGroup from '../database/models/subscriptions';
import {Subscribe} from '../models/subscribe.model';
import Topics from '../database/models/topics';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export class FirebaseController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @post('/messages')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            'x-ts-type': Message,
          },
        },
      },
    })
    message: Message,
  ): Promise<void> {
    await this.sendMessage(message);
  }

  @post('/subscribe')
  async subscribe(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            'x-ts-type': Subscribe,
          },
        },
      },
    })
    message: Subscribe,
  ): Promise<object> {
    await this.subscribeUser(message);
    return {message: "You're subscribed to the topic."};
  }

  async subscribeUser(message: Subscribe): Promise<void> {
    // Subscribe the user to the topic
    await admin
      .messaging()
      .subscribeToTopic(message.token, message.topic)
      .then(async function (response) {
        if (response.failureCount > 0) {
          console.log('Error subscribing to topic:', response.errors);
          return;
        }
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log(
          'Successfully subscribed to topic:' + message.topic,
          response,
        );

        // Find if the topic already exists
        const existingTopic = await Topics.findOne({
          where: {name: message.topic},
        });

        let topic = existingTopic;

        if (!existingTopic) {
          // Just create the topic if it doesn't already exist
          topic = await Topics.create({
            name: message.topic,
          });
        }
        // Check if the subscription already exists, and if so just return
        const existingSubscription = await UserGroup.findOne({
          where: {user: message.token, topic: topic?.id},
        });
        if (existingSubscription) return;

        // Add to usergroup
        await UserGroup.create({
          user: message.token,
          topic: topic?.id,
        });
      })
      .catch(function (error) {
        console.log('Error subscribing to topic:', error);
      });
  }

  async sendMessage(message: Message): Promise<void> {
    // Define the message payload
    const payload = {
      notification: {
        title: message.title,
        body: message.content,
      },
      topic: message.topic,
    };
    // Find if the topic already exists
    const existingTopic = await Topics.findOne({
      where: {name: message.topic},
    });

    if (!existingTopic) {
      console.log(`Topic ${message.topic} does not exist.`);
      return;
    }

    await Messages.create({
      userGroup: existingTopic?.id, // ID of the user group
      title: message.title,
      content: message.content,
    });
    // Send a message to devices subscribed to the provided topic.
    await admin
      .messaging()
      .send(payload)
      .then(response => {
        // Response is a message ID string.
        console.log(
          '\n-- Successfully sent message --',
          `\n${message.title}: Topic: '${payload.topic}'\n==========\n${message.content}`,
          '\n' + response,
          '\n-- cut here --',
        );
      })
      .catch(error => {
        console.log('Error sending message:', error);
      });
  }
}
