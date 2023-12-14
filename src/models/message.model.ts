import {Entity, model, property} from "@loopback/repository";

@model()
export class Message extends Entity {
  // 'title' property -- notification title
  @property({
    type: "string",
    required: true,
  })
  title: string;

  // 'content' property -- notification content
  @property({
    type: "string",
    required: true,
  })
  content: string;

  // 'content' property -- notification content
  @property({
    type: "string",
    required: true,
  })
  topic: string;
}
