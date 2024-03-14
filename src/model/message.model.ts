export enum COMMAND {
    testMessage = 'TEST_MESSAGE',
  }
  
  export type Message = {
    command: string;
    data: any;
  };
  
  // extends Message
  export type TestMessage = Message & {
    command: COMMAND.testMessage;
    data: {
      message: string;
    };
  };

  