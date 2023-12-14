import {Entity, model, property} from '@loopback/repository';

@model()
export class Message extends Entity {
  // 'title' property -- notification title
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  // 'content' property -- notification content
  @property({
    type: 'string',
    required: true,
  })
  content: string;

  // 'topic' property -- notification topic
  @property({
    type: 'string',
    required: false,
  })
  topic: string;

  // 'token' property -- notification token (specific user to notify)
  @property({
    type: 'string',
    required: false,
  })
  token: string;
}
