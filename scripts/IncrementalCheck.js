export default class IncrementalCheck {
  constructor(actor, rollValue) {
    this.actor = actor;
    this.rollValue = rollValue;
    this.FLAG_NAME = "wild-magic-surge-5e";
    this.FLAG_OPTION = "surge_increment";
  }

  async Check() {
    if (!this.actor) {
      return;
    }
    if (!this.actor.data.flags.hasOwnProperty(this.FLAG_NAME)) {
      await this.actor.setFlag(this.FLAG_NAME, this.FLAG_OPTION, 1);
      return this.rollValue === 1;
    }

    let incrementLevel = await this.actor.getFlag(
      this.FLAG_NAME,
      this.FLAG_OPTION
    );

    if (this.rollValue <= incrementLevel) {
      await this.actor.setFlag(this.FLAG_NAME, this.FLAG_OPTION, 1);
      return true;
    } else {
      incrementLevel = incrementLevel + 1;
      await this.actor.setFlag(
        this.FLAG_NAME,
        this.FLAG_OPTION,
        incrementLevel
      );
    }

    return false;
  }
}
