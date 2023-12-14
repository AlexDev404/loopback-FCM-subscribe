import {Entity, model, property} from "@loopback/repository";

@model()
export class Message extends Entity {
  @property({
    type: "string",
    required: true,
  })
  content: string;
  @property({
    type: "string",
    required: true,
  })
  title: string;
}
