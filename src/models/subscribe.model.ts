import {Entity, model, property} from "@loopback/repository";

@model()
export class Subscribe extends Entity {
  @property({
    type: "string",
    required: true,
  })
  token: string;
  @property({
    type: "string",
    required: true,
  })
  topic: string;
}
