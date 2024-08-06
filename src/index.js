class Card extends HTMLElement {
  /**
   * @public
   * @type any
   */
  set hass(hass) {
    this.homeassistant = hass
    if (!this.initialized) this.init()
  }

  init() {
    /**
     * Is true after card is initialized
     * @private
     * @type {Boolean}
     */
    this.initialized = true

    this.innerHTML = `
      <ha-card header="Home 3D">
        <div class="card-content">
          <canvas></canvas>
        </div>
      </ha-card>
    `
  }

  setConfig(config) {
    this.config = config
  }

  getCardSize() {
    return 10
  }

  getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 2,
      grid_min_rows: 3,
      grid_max_rows: 3,
    }
  }
}

customElements.define('home-3d', Card)
