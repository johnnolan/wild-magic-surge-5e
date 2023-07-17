class Logger {
  public static log(
    description: string,
    module = "global",
    data: unknown = {},
  ): void {
    console.log("Wild Magic Surge", module, description, data);
  }

  public static debug(
    description: string,
    module = "global",
    data: unknown = {},
  ): void {
    console.debug("Wild Magic Surge", module, description, data);
  }

  public static warn(
    description: string,
    module = "global",
    data: unknown = {},
  ): void {
    console.warn("Wild Magic Surge", module, description, data);
  }

  public static error(
    description: string,
    module = "global",
    data: unknown = {},
  ): void {
    console.error("Wild Magic Surge", module, description, data);
  }
}

export default Logger;
