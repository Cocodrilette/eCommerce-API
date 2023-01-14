export class ResponseParser {
  createdSuccessfully(object: any, name: string) {
    return {
      statusCode: 200,
      message: `${name} created successfully`,
      object,
    };
  }

  successQuery(objects: any[] | any, count = null, name: string) {
    if (count) {
      return {
        statusCode: 200,
        message: `${name} query performed correctly`,
        count,
        objects,
      };
    }

    return {
      statusCode: 200,
      message: `${name} query performed correctly`,
      object: objects,
    };
  }

  deletedSuccessfully(name: string, id: string) {
    return {
      statusCode: 200,
      message: `${name} deleted successfully`,
      id,
    };
  }

  updatedSuccessfully(name: string, object: any, id: string) {
    return {
      statusCode: 200,
      message: `${name} updated successfully`,
      id,
      updateProduct: object,
    };
  }
}
