import {Entity, model, property} from "@loopback/repository";

@model()
export class Subscribe extends Entity {
  // 'token' property -- the token of the device to subscribe
  @property({
    type: "string",
    required: true,
  })
  token: string;

  // 'topic' property -- topic name to subscribe to
  @property({
    type: "string",
    required: true,
  })
  topic: string;
}
