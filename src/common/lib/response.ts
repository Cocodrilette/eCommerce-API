export class ResponseParser {
  createdSuccessfully(object: any, name: string) {
    return {
      response: {
        statusCode: 200,
        message: `${name} created successfully`,
        object,
      },
    };
  }

  successQuery(objects: any[] | any, count = null, name: string) {
    if (count) {
      return {
        response: {
          statusCode: 200,
          message: `${name} query performed correctly`,
          count,
          objects,
        },
      };
    }

    return {
      response: {
        statusCode: 200,
        message: `${name} query performed correctly`,
        object: objects,
      },
    };
  }

  deletedSuccessfully(name: string, id: string) {
    return {
      response: {
        statusCode: 200,
        message: `${name} deleted successfully`,
        id,
      },
    };
  }
}
