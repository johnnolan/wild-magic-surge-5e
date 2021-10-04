export default class IncrementalCheck {
  constructor(actor, rollValue) {
    this.actor = actor;
    this.rollValue = rollValue;
    this.defaultValue = {
      max: 20,
      min: 1,
      value: 1,
    };
    this.FLAG_NAME = "wild-magic-surge-5e";
    this.FLAG_OPTION = "surge_increment_resource";
  }

  async SetupDefault() {
    await this.actor.setFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION,
      this.defaultValue
    );
    return this.rollValue === 1;
  }

  async Check() {
    if (!this.actor) {
      return;
    }

    if (!this.actor.data.flags.hasOwnProperty(this.FLAG_NAME)) {
      return await this.SetupDefault();
    }

    let incrementLevel = await this.actor.getFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION
    );

    if (!incrementLevel) {
      return await this.SetupDefault();
    }

    if (this.rollValue <= incrementLevel.value) {
      await this.actor.setFlag(
        this.FLAG_NAME,
        this.FLAG_OPTION,
        this.defaultValue
      );
      return true;
    } else {
      incrementLevel.value = incrementLevel.value + 1;
      await this.actor.setFlag(
        this.FLAG_NAME,
        this.FLAG_OPTION,
        incrementLevel
      );
    }

    return false;
  }
}
