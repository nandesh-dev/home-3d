import { Visual } from './visual.js'

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
        <div class="card-content" style="box-sizing: border-box">
          <div id="home-3d-outer" style="overflow: hidden; width: 100%; border-radius: 0.5rem; aspect-ratio: 2;"></div>
        </div>
      </ha-card>
    `

    this.container = this.querySelector('#home-3d-outer')
    requestAnimationFrame(() => {
      let visual = new Visual(this.container)
    })
  }

  setConfig(config) {
    this.config = config
  }

  getCardSize() {
    return 10
  }

  getLayoutOptions() {
    return {
      grid_rows: 6,
      grid_columns: 4,
      grid_min_rows: 3,
      grid_max_rows: 6,
    }
  }
}

customElements.define('home-3d', Card)
