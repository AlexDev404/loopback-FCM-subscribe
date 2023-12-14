import {post, response, Request, requestBody, RestBindings} from "@loopback/rest";
import {inject} from '@loopback/core';
import {Message} from "../models/message.model";
import {Subscribe} from "../models/subscribe.model";
import * as admin from "firebase-admin";
import serviceAccount from "../credentials/ub-loopback-21d702568ef8.json"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export class FirebaseController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

  @post("/messages")
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: {
            "x-ts-type": Message,
          },
        },
      },
    })
    message: Message
  ): Promise<void> {
    await this.sendMessage(message);
  }

  @post("/subscribe")
  async subscribe(
    @requestBody({
      content: {
        "application/json": {
          schema: {
            "x-ts-type": Subscribe,
          },
        },
      },
    })
    message: Subscribe
  ): Promise<object> {
    await this.subscribeUser(message);
    return {message: "You're subscribed to the topic."}
  }

  async subscribeUser(message: Subscribe): Promise<void> {
    // Subscribe the user to the topic
    await admin.messaging().subscribeToTopic(message.token, message.topic)
      .then(function (response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:' + message.topic, response);
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
        body: message.content
      },
      topic: 'default'
    };

    // Send a message to devices subscribed to the provided topic.
    await admin.messaging().send(payload)
      .then((response) => {
        // Response is a message ID string.
        console.log('\n-- Successfully sent message --', `\n${message.title}: Topic: '${payload.topic}'\n==========\n${message.content}`, "\n" + response, "\n-- cut here --");
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
