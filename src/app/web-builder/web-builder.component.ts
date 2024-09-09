import 'grapesjs/dist/css/grapes.min.css';

import { Component, ViewEncapsulation } from '@angular/core';

import grapesjs from 'grapesjs';
import grapesjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';
import grapesjs_preset_webpage from 'grapesjs-preset-webpage';

@Component({
  selector: 'app-web-builder',
  standalone: true,
  imports: [],
  templateUrl: './web-builder.component.html',
  styleUrl: './web-builder.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WebBuilderComponent {
  constructor() { }

  editor: any;
  ngOnInit(): void {
    this.editor = grapesjs.init({
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: '100vh',
      width: 'auto',
      // Disable the storage manager for the moment
      storageManager: false,
      plugins: [grapesjs_preset_webpage, grapesjs_blocks_basic, grapesjs_plugin_forms],
      pluginsOpts: {
        grapesjs_preset_webpage: {},
        grapesjs_blocks_basic: {
          blocks: ['column1', 'column2', 'column3', 'column3-7'],
          category: 'Layout',
        },
        grapesjs_plugin_forms: {},
      },
      // Avoid any default panel
      panels: {
        defaults: []
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [{
          id: 'text',
          label: 'Text',
          category: 'Basic',
          content: '<div data-gjs-type="text">Insert your text here</div>',
        }, {
          id: 'image',
          label: 'Image',
          // Select the component once it's dropped
          select: true,
          category: 'Basic',
          // You can pass components as a JSON instead of a simple HTML string,
          // in this case we also use a defined component type `image`
          content: { type: 'image' },
          // This triggers `active` event on dropped components and the `image`
          // reacts by opening the AssetManager
          activate: true,
        }
        ]
      }
    });

    this.editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });
    this.editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor: any) {
            editor.Modal.setTitle('Components JSON')
              .setContent(`<textarea style="width:100%; height: 250px;">
                ${JSON.stringify(editor.getComponents())}
              </textarea>`)
              .open();
          },
        }
      ],
    });

    this.addInnerStyle();

    this.addCustomBlocks();

    this.editor.on('load', () => {
      const panelManager = this.editor.Panels;

      // Získajte tlačidlá pridané pluginmi, ak sú nejaké prítomné
      const panels = panelManager.getPanels();

      // Prechádzajte cez existujúce panely a presuňte tlačidlá do vašich panelov
      panels.forEach((panel: { get: (arg0: string) => any; }) => {
        const buttons = panel.get('buttons');
        buttons.forEach((button: { attributes: any; }) => {
          panelManager.addButton('basic-actions', button.attributes);
        });
      });

      // Odstráňte panely vytvorené pluginmi
      panels.forEach((panel: { id: string; }) => {
        if (panel.id !== 'panel-top' && panel.id !== 'basic-actions') {
          panelManager.removePanel(panel.id);
        }
      });
    });
  }

  addCustomBlocks() {
    const blockManager = this.editor.BlockManager;

    blockManager.add('section', {
      label: 'Odberateľ',
      category: 'Fakturácia',
      media: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    `,
      content: `<div style="display: flex; flex-direction: column; gap: 0px; font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6; margin-bottom: 20px;">
  <label for="customer-input" style="font-weight: bold; margin-bottom: 5px; color: #fff;">Odberateľ</label>
  <input type="text" id="customer-input" value="Emil Gonšor - EGO" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 100%; box-sizing: border-box; background-color: #2a2b32; color: #fff;" />

  <div style="margin-top: 0px; font-size: 13px; color: #888;">
    Ulica Grúnik 766/7, 029 56 Zákamenné, Slovenská republika, IČO: 37388304,
    IČ DPH: SK1020470154
  </div>
</div>
`,
    });

    blockManager.add('currency-rate', {
      label: 'Mena a Kurz',
      category: 'Fakturácia',
      media: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 1v22M6 8h12M6 16h12" />
      <path d="M8 12c0-2 1-4 4-4s4 2 4 4-1 4-4 4-4-2-4-4z" />
    </svg>
      `,
      content: `
        <div style="display: flex; gap: 10px; align-items: flex-start; font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6;">
  <div style="display: flex; flex-direction: column;">
    <label for="currency-input" style="margin-bottom: 5px; color: #fff;">Mena</label>
    <input type="text" id="currency-input" value="EUR" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 100px; box-sizing: border-box; background-color: #2a2b32; color: #fff;" />
  </div>

  <div style="display: flex; flex-direction: column;">
    <label for="rate-input" style="margin-bottom: 5px; color: #fff;">Kurz</label>
    <input type="text" id="rate-input" value="1,00" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 100px; box-sizing: border-box; background-color: #2a2b32; color: #fff;" />
  </div>
</div>
      `
    });

    // Blok "Splatnosť"
  blockManager.add('due-date', {
    label: 'Splatnosť',
    category: 'Fakturácia',
    media: `
      <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <text x="6" y="16" font-size="8" fill="#d2bdb6">14</text>
      </svg>
    `,
    content: `
<div style="display: flex; flex-direction: column; font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6;">
  <label for="due-days" style="margin-bottom: 5px; color: #fff;">Splatnosť</label>
  <div style="display: flex; gap: 10px;">
    <input type="text" id="due-days" value="14" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 50px; box-sizing: border-box; background-color: #2a2b32; color: #fff;" />
    <input type="text" id="due-date" value="22.8.2024" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 100px; box-sizing: border-box; background-color: #2a2b32; color: #fff;" />
  </div>
</div>
    `
  });

  // Blok "DPH Výpočet"
  blockManager.add('vat-calculation', {
    label: 'DPH Výpočet',
    category: 'Fakturácia',
    media: `
      <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <line x1="6" y1="8" x2="18" y2="8"></line>
        <line x1="6" y1="12" x2="18" y2="12"></line>
        <line x1="6" y1="16" x2="12" y2="16"></line>
      </svg>
    `,
    content: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6; background-color: #2a2b32; padding: 10px; border: 1px solid #555;">
        <div data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 5px;">
          <div data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="color: #888;">Základ DPH</span>
            <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="color: #888;">640,00 EUR</span>
          </div>
          <div data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="display: flex; justify-content: space-between;">
            <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="color: #888;">DPH</span>
            <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="color: #888;">16,00 EUR</span>
          </div>
        </div>
        <div data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false" style="display: flex; justify-content: space-between; font-weight: bold; color: #fff;">
          <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false">Celkovo</span>
          <span data-gjs-editable="false" data-gjs-draggable="false" data-gjs-removable="false" data-gjs-draggable="false">656,00 EUR</span>
        </div>
      </div>
    `
  });
    

// Blok "Tabuľka Položiek"
blockManager.add('item-table', {
  label: 'Tabuľka Položiek',
  category: 'Fakturácia',
  media: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
      <line x1="2" y1="16" x2="22" y2="16"></line>
      <line x1="6" y1="4" x2="6" y2="20"></line>
      <line x1="12" y1="4" x2="12" y2="20"></line>
      <line x1="18" y1="4" x2="18" y2="20"></line>
    </svg>
  `,
  content: `
     <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6;">
      <thead>
        <tr style="border-bottom: 1px solid #555; text-align: left; color: #888;">
          <th style="padding: 8px;">P. Č.</th>
          <th style="padding: 8px;">NÁZOV POLOŽKY</th>
          <th style="padding: 8px;">MNOŽSTVO</th>
          <th style="padding: 8px;">MJ</th>
          <th style="padding: 8px;">CENA</th>
          <th style="padding: 8px;">SPOLU</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #555; color: #fff;">
          <td style="padding: 8px;">1</td>
          <td style="padding: 8px;">stol<br/><span style="font-size: 12px; color: #888;">Stolička obyčajná</span></td>
          <td style="padding: 8px;">1,00</td>
          <td style="padding: 8px;">ks</td>
          <td style="padding: 8px; text-align: right;">560,00</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">560,00</td>
        </tr>
        <tr style="border-bottom: 1px solid #555; background-color: #3a3b3c; color: #fff;">
          <td style="padding: 8px;">2</td>
          <td style="padding: 8px;">Zdenko Hromy Tokár<br/><span style="font-size: 12px; color: #888;">Popis</span></td>
          <td style="padding: 8px;">1,00</td>
          <td style="padding: 8px;">ks</td>
          <td style="padding: 8px; text-align: right;">0,00</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">0,00</td>
        </tr>
        <tr style="border-bottom: 1px solid #555; color: #fff;">
          <td style="padding: 8px;">3</td>
          <td style="padding: 8px;">Názov<br/><span style="font-size: 12px; color: #888;">Popis</span></td>
          <td style="padding: 8px;">1,00</td>
          <td style="padding: 8px;">ks</td>
          <td style="padding: 8px; text-align: right;">0,00</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">0,00</td>
        </tr>
      </tbody>
    </table>
  `
});

// Blok "Separator"
blockManager.add('separator', {
  label: 'Separator',
  category: 'Basic',
  media: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="12" x2="20" y2="12"></line>
    </svg>
  `,
  content: `
    <hr style="border: none; border-top: 1px solid #555; margin: 20px 0;"/>
  `
});

// Blok "Zádržné"
blockManager.add('retention', {
  label: 'Zádržné',
  category: 'Fakturácia',
  media: `
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="10" width="22" height="12" rx="6" ry="6" fill="#444"/>
      <circle cx="8" cy="16" r="5" fill="#888"/>
    </svg>
  `,
  content: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <label class="toggle-switch" style="margin-right: 10px;">
          <input type="checkbox" id="toggleRetention" onchange="toggleRetentionFields(event)">
          <span class="slider"></span>
        </label>
        <span>Zádržné</span>
      </div>
      <div id="retentionFields" style="display: block;">
        <div style="margin-bottom: 0px; display: flex; gap: 10px;">
          <span style="color: #888; margin-top:10px;">1.</span>
          <input type="text" value="0 %" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 80px; background-color: #2a2b32; color: #fff;" />
          <input type="text" value="0,00 EUR" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 120px; background-color: #2a2b32; color: #fff;" />
        </div>
        <div style="display: flex; gap: 10px;">
          <span style="color: #888; margin-top: 10px">2.</span>
          <input type="text" value="0 %" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 80px; background-color: #2a2b32; color: #fff;" />
          <input type="text" value="0,00 EUR" style="border: 1px solid #555; border-radius: 4px; padding: 8px; font-size: 14px; width: 120px; background-color: #2a2b32; color: #fff;" />
        </div>
      </div>
    </div>

    <style>
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #444;
        border-radius: 20px;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: #888;
        top: 3px;
        left: 4px;
        transition: .4s;
      }

      input:checked + .slider {
        background-color: #005a87;
      }

      input:checked + .slider:before {
        transform: translateX(20px);
        background-color: #00bfff;
      }
    </style>

    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const toggleSwitch = document.getElementById('toggleRetention');
        if (toggleSwitch) {
          toggleSwitch.addEventListener('change', function(event) {
            const fields = document.getElementById('retentionFields');
            if (fields) {
              fields.style.display = event.target.checked ? 'block' : 'none';
            }
          });
        }
      });
    </script>
  `
});


// Blok "Pečiatka, podpis"
blockManager.add('stamp-signature', {
  label: 'Pečiatka, podpis',
  category: 'Faktuácia',
  media: `
<svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#d2bdb6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 11h14l-2 9H7l-2-9z" />
  <path d="M8 11V6a4 4 0 0 1 8 0v5" />
  <path d="M10 19h4" />
</svg>
  `,
  content: `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #d2bdb6;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <label class="toggle-switch" style="margin-right: 10px;">
          <input type="checkbox" id="toggleStampSignature" onchange="toggleStampSignature(event)">
          <span class="slider"></span>
        </label>
        <span>Pečiatka, podpis</span>
      </div>
      <div id="stampSignatureContent" style="display: block;">
        <div style="display: flex; justify-content: center; align-items: center; border: 1px solid #555; border-radius: 4px; padding: 20px; background-color: #2a2b32; margin-bottom: 10px;">
          <div style="width: 100%; text-align: center;">
            <img src="path_to_qr_code_image.png" alt="QR Code" style="width: 120px; height: 120px; background-color: #000; padding: 10px; border-radius: 4px;" />
            <div style="color: #fff; margin-top: 10px;">Pečiatka, podpis</div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
      }

      .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #444;
        border-radius: 20px;
        transition: .4s;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        border-radius: 50%;
        background-color: #888;
        top: 3px;
        left: 4px;
        transition: .4s;
      }

      input:checked + .slider {
        background-color: #005a87;
      }

      input:checked + .slider:before {
        transform: translateX(20px);
        background-color: #00bfff;
      }
    </style>

    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const toggleSwitch = document.getElementById('toggleStampSignature');
        if (toggleSwitch) {
          toggleSwitch.addEventListener('change', function(event) {
            const content = document.getElementById('stampSignatureContent');
            if (content) {
              content.style.display = event.target.checked ? 'block' : 'none';
            }
          });
        }
      });
    </script>
  `
});


  }

  private addInnerStyle() {
    this.editor.on('load', () => {
      const iframe = this.editor.Canvas.getFrameEl();
      const iframeHead = iframe.contentDocument.head;

      // Vytvorenie nového štýlového prvku
      const style = document.createElement('style');
      style.innerHTML = `
        body {
          background-color: #2A2B35 !important;
          padding: 20px;
          border: none;
        }

        .gjs-dashed {
          border: none !important;
          outline: 0px !important;
        }

/* Nadpisy a texty */
h1, h2, h3, h4, h5, h6 {
  color: #ffffff; /* Biela farba nadpisov */
  font-weight: normal;
}

label {
  font-size: 14px;
  color: #ffffff; /* Biela farba pre popisy */
  margin-bottom: 5px;
  display: block;
}

/* Vstupné polia */
input[type="text"],
input[type="date"],
input[type="number"],
select {
  background-color: rgba(217, 224, 237, 0.1); /* Tmavé pozadie pre vstupné polia */
  color: #ffffff; /* Biela farba textu vo vstupných poliach */
  border: 1px solid #3a3b41; /* Ohraničenie vstupných polí */
  border-radius: 4px; /* Zaoblené rohy */
  padding: 8px 12px; /* Vnútorné odsadenie */
  font-size: 14px;
  height: 40px; /* Výška */
  box-sizing: border-box; /* Zahrnúť padding do šírky */
  margin-bottom: 15px; /* Spodné odsadenie medzi prvkami */
}

/* Vstupné polia s ikonami */
input[type="text"]::placeholder,
input[type="date"]::placeholder,
input[type="number"]::placeholder {
  color: #888888; /* Svetlo šedá farba pre placeholder */
  opacity: 1; /* Plná opacita pre placeholder */
}

.icon-input-wrapper {
  position: relative;
}

.icon-input-wrapper input {
  padding-right: 30px; /* Priestor pre ikonu */
}

.icon-input-wrapper .input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888888; /* Farba ikony */
  pointer-events: none; /* Zabezpečí, že ikona nebude klikateľná */
}

/* Textové oblasti */
textarea {
  background-color: #2a2b32; /* Tmavé pozadie pre textové oblasti */
  color: #ffffff; /* Biela farba textu */
  border: 1px solid #3a3b41; /* Ohraničenie */
  border-radius: 4px; /* Zaoblené rohy */
  padding: 8px 12px; /* Vnútorné odsadenie */
  font-size: 14px;
  width: 100%;
  box-sizing: border-box; /* Zahrnúť padding do šírky */
  margin-bottom: 15px; /* Spodné odsadenie */
  resize: none; /* Zakáže zmenu veľkosti */
}

/* Tlačidlá */
button {
  background-color: transparent; /* Transparentné pozadie pre štandardné tlačidlá */
  color: #ffffff; /* Biela farba textu */
  border: 1px solid #e7954c; /* Ohraničenie tlačidla */
  padding: 8px 20px; /* Vnútorné odsadenie */
  font-size: 14px;
  border-radius: 20px; /* Zaoblené rohy */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button.primary {
  background-color: #e7954c; /* Oranžové pozadie pre hlavné tlačidlá */
  color: #1b1c22; /* Tmavý text pre hlavné tlačidlá */
  border: none; /* Bez ohraničenia */
}

button:hover {
  background-color: #ffffff; /* Svetlé pozadie pri hover */
  color: #1b1c22; /* Tmavý text pri hover */
}

button.primary:hover {
  background-color: #e7954c; /* Zmena farby pri hover pre hlavné tlačidlo */
  color: #ffffff;
}

/* Základné sekcie a kontajnery */
.section {
  margin-bottom: 30px; /* Spodné odsadenie medzi sekciami */
  padding: 15px;
  border: 1px solid #3a3b41; /* Ohraničenie sekcií */
  border-radius: 4px; /* Zaoblené rohy */
  background-color: #2a2b32; /* Tmavé pozadie sekcií */
}

/* Linky */
a {
  color: #e7954c; /* Oranžová farba pre linky */
  text-decoration: none;
}

a:hover {
  text-decoration: underline; /* Podčiarknutie pri hover */
}

/* Skrývacie sekcie (Viac údajov) */
.toggle-section {
  display: none; /* Skryté v základe */
}

.toggle-section.visible {
  display: block; /* Viditeľné po kliknutí */
}

/* Základné štýly pre toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Styl samotného prepínača */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #444; /* Tmavé pozadie pre neaktívny stav */
  border-radius: 20px;
  transition: .4s;
}

/* Bodka na prepínači */
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: #888; /* Svetlo šedá pre bodku */
  top: 3px;
  left: 4px;
  transition: .4s;
}

/* Pri zaškrtnutí */
input:checked + .slider {
  background-color: #005a87; /* Tmavomodrá farba pre aktívny stav */
}

input:checked + .slider:before {
  transform: translateX(20px); /* Posun bodky pri aktívnom stave */
  background-color: #00bfff; /* Svetlo modrá pre bodku pri aktívnom stave */
}


      `;

      // Pridanie štýlu do hlavičky iframe
      iframeHead.appendChild(style);
    });
  }
}