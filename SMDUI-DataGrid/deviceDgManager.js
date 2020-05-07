class DeviceDg extends HTMLElement {
    constructor() {
        super();
        this.options = [];
        this.selectedItem = '';
        
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');

        this.dg = document.createElement('smdui-dg');
        this.dg.classList.add('device-grid');

        this.devInfo = document.createElement('div');
        this.devInfo.classList.add('dev-info');

        this.attachShadow({mode: "open"});

        this.shadowRoot.innerHTML = `
        <style>
            .wrapper{
                display:flex;
                flex-direction: row;
                justify-content: space-around;
                width: 100%;
            }

            .device-grid{
                max-width: fit-content;
                max-height: fit-content;
            }

            .dev-info{
                width: inherit;
                margin: 5px;
                min-height: 10px;
                border-radius: 2px;
            }
        </style>
        `;
    }

    init(devListArr) {
//        console.log(devListArr);
        let dg = this.dg;
        dg.gridItems = [];
        this.style.width = "100%";

        this._createOptionsButton()

        let item = {};
        for (let i = 0; i < devListArr.length; i++) {
            item = devListArr[i];
            item.id = item.serialNumber; //adding id to devListArr
//            item.name = item.id;
        }

        dg.open(devListArr);
        this.wrapper.appendChild(this.dg);
        this.wrapper.appendChild(this.devInfo);
        this.shadowRoot.appendChild(this.wrapper);
        this._createGridPanel();
        dg.setSelected(dg.gridItems[0], devListArr[0]);
        this.selectedItem = dg.getSelected();
        this.onSelection();
        this._createDeviceInfo();
        
    }

    getSelected() {
        console.log(this.dg.getSelected());
    }

    _createGridPanel() {
        let devListArr = this.dg.itemListArr;
        let gridItems = this.dg.gridItems;
//        console.log(gridItems);
//        console.log(devListArr);

        let imgFolderPath = "\\defaultImages";
        for (let i = 0; i < gridItems.length; i++) {
            if (devListArr[i].serialNumber === gridItems[i].id) {
                console.log(devListArr[i])
                let panel = document.createElement('div');
                
 //               <i class="material-icons ui-icon-report" style="color: #ff6942;"></i>
                let devTopIconAlert = document.createElement('span');
                devTopIconAlert.classList.add('devTopIconAlert')
                devTopIconAlert.style.margin = '3px';
                devTopIconAlert.addEventListener('mouseover', () => devTopIconAlert.style.boxShadow = '2px 2px 2px 2px rgba(0,0,0,0.5)');
                devTopIconAlert.addEventListener('mouseleave', () => devTopIconAlert.style.boxShadow = 'none');
                let warningCount = document.createElement('span');
                warningCount.classList.add('warningCount');
                warningCount.textContent = '0';
                devTopIconAlert.appendChild(warningCount);
                let warningIcon = document.createElement('i');
                warningIcon.classList.add('material-icons');
                warningIcon.classList.add('ui-icon-report');
                warningIcon.style.color = '#ff6942';
                devTopIconAlert.appendChild(warningIcon);
                panel.appendChild(devTopIconAlert);
                
                let imagesPanel = document.createElement('div');
                panel.appendChild(imagesPanel);

                let devImg = document.createElement('img');
                let modelID = devListArr[i].modelID;
                let subModelID = devListArr[i].subModelID;
                devImg.setAttribute('src', imgFolderPath + "\\devIcon_" + modelID + "_" + subModelID + ".png");
                devImg.style.maxWidth = "100px";
                devImg.style.maxHeigh = "150px";
                imagesPanel.appendChild(devImg);
                
//                let connectionIconSpan = document.createElement('span');
//                connectionIconSpan.innerHTML = `
//                <i class = "fa fa-unlink devDisconnectedIcon"></i>
//`;
////                disconnectedIcon.classList.add("fa");
////                disconnectedIcon.classList.add("fa-unlink");
////                disconnectedIcon.classList.add("devDisconnectedIcon");
////                disconnectedIcon.style.color = "#ffac42";
//                imagesPanel.append(connectionIconSpan);
                

                let devSNSpan = document.createElement('span');
                let devSN = devListArr[i].serialNumber;
                devSNSpan.textContent = devSN;
                devSNSpan.classList.add('serialNumberSpan');
                panel.append(devSNSpan);


                gridItems[i].appendChild(panel);

            }
        }
    }

    _createOptionsButton() {
        this.options.push({
            name: 'horizontal',
            cb: function () {
                this.dg.setAttribute('horizontal', '');
                this.wrapper.style.flexDirection = 'column';
                this.dg.style.justifyContent = 'center';
            }.bind(this)
        });

        this.options.push({
            name: 'vertical', cb: function () {
                this.dg.setAttribute('vertical', '');
                this.wrapper.style.flexDirection = 'row';
                this.dg.style.justifyContent = 'flex-start';

            }.bind(this)
        });

        this.dg.addOptions(this.options);
    }
    
    _createDeviceInfo(){
        let slot = document.createElement('slot');
        slot.setAttribute('name', 'devInfo');
        this.devInfo.appendChild(slot);
    }
    
    onSelection(){
//        devManager.setSelected();
    }
}

customElements.define('device-dg-manager', DeviceDg)