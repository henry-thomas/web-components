class Tree extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.listItem;
        this.menuDepth;
        this.tempMenuArrBuff;
        this.prevObArr;
        this.backOption;
        this.shadowRoot.innerHTML = `
        <style>

            .tree-item {
                position: relative;
                right: 0px;
                padding: 0.5rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid #ccc;
                opacity: 1;
                transform: translateX(0rem);
                transition: all 300ms ease-out;
            }

            .hide-next {
                opacity: 0;
                transform: translateX(5rem);
                transition: all 300ms ease-out;
            }

            .hide-previous {
                opacity: 0;
                transform: translateX(-3rem);
                transition: all 300ms ease-out;
            }

            .show {
                opacity:1;
                transform: translateX(0rem);
                transition: all 300ms ease-out;
            }
            
            .hide-back-btn {
                opacity: 0;
                pointer-events: none;
            }

            .show-back-btn {
                opacity: 1;
                pointer-events: click mouseenter mouseleave;
            }

            #backBtn {
                position: relative;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                background: rgba(0,0,0,0.25);
             }

             #backOption {
                 padding: 0.5rem;
                 
             }

            #main div{
                display: flex;
                flex-direction: column;
                position: relative;
                top: 0;
                left: 0px;
                height: 100px;
                width: auto;
                background: rgba(0,0,0,0.15);
                border-radius: 3px 3px 0px 0px;
                padding: 0.5rem;
                overflow-y: auto;
                overflow-x: hidden;
            };

        </style>
        
        <div>
            <section id = "main">
            <div></div>
            </section>
            <section id = "backBtn"> 
            </section>
        </div>
        `;

    }

    connectedCallback() {
        this.canvas = this.shadowRoot.querySelector('#main div');
        this.backCanvas = this.shadowRoot.querySelector('#backBtn');
    }

    _render(menuObjArr, clickedItem, backBoolean, event) {

        let selectedHTML;
        if (event) {
            selectedHTML = event.target;
        }
        if (Array.isArray(menuObjArr)) {
            // console.log(this.listItem);
            // console.log(menuObjArr);
            this.listItem = [];
            this.tempMenuArrBuff.push(menuObjArr);

            this.canvas.innerHTML = '';
            this.backCanvas.innerHTML = '';

            for (let i = 0; i < menuObjArr.length; i++) {

                let obj = menuObjArr[i];
                let label = menuObjArr[i].label;
                this.listItem[i] = document.createElement('span');
                this.listItem[i].textContent = label;
                this.listItem[i].setAttribute('menuItem', i);
                this.listItem[i].classList.add("tree-item");
                this.listItem[i].addEventListener('mouseenter', () => {
                    this.listItem[i].style.background = 'rgba(0,0,0,0.15)';
                    this.listItem[i].style.cursor = 'pointer';
                });
                this.listItem[i].addEventListener('mouseleave', () => {
                    this.listItem[i].style.background = 'rgba(0,0,0,0.00)'
                });
                this.listItem[i].style.pointerEvents = 'click mouseenter mouseleave';
                this.listItem[i].addEventListener('click', this._next.bind(this, obj.children, obj)); //obj.children is an array of objects. pass back to _render next menu on click
                this.canvas.appendChild(this.listItem[i]);


                //a boolean value is checked when an object is clicked. Returns whether back or next animation.
                if (this.menuDepth >= 1 && backBoolean == false) {
                    this.listItem[i].classList.add("hide-next");
                }
                if (backBoolean === true) {
                    this.listItem[i].classList.add("hide-previous");
                }
            }

            this.backOption = document.createElement('span');
            this.backOption.textContent = '< Back';
            this.backOption.setAttribute('id', 'backOption');
            this.backOption.addEventListener('mouseenter', () => {
                this.backOption.style.background = 'rgba(0,0,0,0.15)';
                this.backOption.style.cursor = 'pointer'
            });
            this.backOption.addEventListener('mouseleave', () => { this.backOption.style.background = 'rgba(0,0,0,0.00)' });
            this.backOption.addEventListener('click', this._back.bind(this, null, null, event));
            this.backOption.classList.add('hide-back-btn');
            this.backCanvas.appendChild(this.backOption);

            if (this.menuDepth >= 1) {
                this.backOption.classList.remove('hide-back-btn');
                this.backOption.classList.add('show-back-btn');
            }

        } else { //this means the user has reached the root.
            selectedHTML.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
            this.setAttribute('value', JSON.stringify(clickedItem));
            this.menuDepth -= 1;
        }

    }

    _back(nextObArr, obj, event) {

        this.backOption.style.pointerEvents = 'none'; //blocks unintended clicks messing up counters during animations
        let self = this;
        this.menuDepth -= 1;
        this.prevObArr = this.tempMenuArrBuff[this.menuDepth];

        setTimeout(self._render.bind(self), 300, self.prevObArr, null, true, event);
        this._hideNext();

        setTimeout(this._showPrevious.bind(this), 300)
        this.tempMenuArrBuff.pop();
        this.tempMenuArrBuff.pop();
    }

    _next(nextObArr, obj, event) {
        this.menuDepth += 1;
        if (obj.children) {
            setTimeout(this._render.bind(this), 200, nextObArr, obj, false, event)
            this._hidePrev();
        } else {
            this._render(nextObArr, obj, false, event);
        }
        setTimeout(this._showNext.bind(this), 300);
    }

    _showPrevious(el) {
        let self = this;
        setTimeout(function () { for (let i = 0; i < self.listItem.length; i++) { self.listItem[i].classList.remove('hide-previous') } }, 0);
        setTimeout(function () { for (let i = 0; i < self.listItem.length; i++) { self.listItem[i].classList.add('show') } }, 0);
    }


    _hidePrev(list) {
        let self = this;
        for (let i = 0; i < self.listItem.length; i++) {
            self.listItem[i].style.pointerEvents = 'none'; //block unintended clicks messing up counters during animation
            self.listItem[i].classList.add('hide-previous');
            self.listItem[i].classList.remove('hide-next');
            self.listItem[i].classList.remove('show');
        };
    }
    _hideNext(list) {
        let self = this;
        for (let i = 0; i < self.listItem.length; i++) {
            self.listItem[i].classList.remove('show')
            self.listItem[i].classList.add('hide-next')
        };
    }

    _showNext(t) {
        let self = this;

        setTimeout(function () {
            for (let i = 0; i < self.listItem.length; i++) {
                self.listItem[i].classList.remove('hide-previous')
                self.listItem[i].classList.add('show')
                self.listItem[i].classList.remove('hide-next')
            };
        }, 0);

    }

    open(menuObjArr) {
        this.menuDepth = 0;
        this.tempMenuArrBuff = [];
        this._render(menuObjArr, null);
    }
}

customElements.define('smdui-tree', Tree);