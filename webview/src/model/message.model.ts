export enum COMMAND {
  testMessageFromWebview = 'TEST_MESSAGE',
  testMessageFromExtension = 'TEST_MESSAGE',
  hexStringMessage = "HEX_STRING_MESSAGE",
  jsonStringMessage = "JSON_STRING_MESSAGE"
}

export type Message = {
  command: string;
  data: any;
};

// extends Message
export type MessageFromWebview = Message & {
  command: COMMAND.testMessageFromWebview;
  data: {
    message: string;
  };
};

// extends Message
export type MessageFromExtension = Message & {
  command: COMMAND.testMessageFromExtension;
  data: {
    message: string;
  }
};

// extends Message
export type MessageHexString = Message & {
  command: COMMAND.hexStringMessage;
  data: {
    message: string[][];
  }
};

// extends Message
export type MessageJsonString = Message & {
  command: COMMAND.jsonStringMessage;
  data: {
    message: string|undefined;
  }
};