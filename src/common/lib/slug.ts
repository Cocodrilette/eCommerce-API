export class SlugParser {
  parse(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '_') // collapse whitespace and replace by -
      .replace(/-+/g, '_'); // collapse dashes
  }
}
