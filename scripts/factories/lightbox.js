export class Lightbox {
  #lightbox = [];
  #currentIndex = 0;
  #modal = null;
  #containerImg = null;
  #title = null;

  constructor() {
    const lightbox = document.querySelectorAll("[data-lightbox]");
    if (lightbox.length > 0) {
      for (const element of lightbox) {
        const item = {
          src: element.src,
          type: element.nodeName,
          title: element.getAttribute("data-lightbox"),
        };
        this.#lightbox.push(item);
        element.addEventListener("click", this._handleClick.bind(this));
        element.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            this._open();
          }
        });
      }
    }
  }

  _handleClick(e) {
    const currentElement = e.currentTarget;
    const src = currentElement.src;
    this.#currentIndex = this.#lightbox.findIndex((item) => {
      return item.src === src;
    });

    this._open();
  }
  _open() {
    const body = document.querySelector("body");
    const btnPrev = document.createElement("button");
    btnPrev.className = "btnPrev";
    btnPrev.innerHTML = "<i class='fa-solid fa-chevron-left'></i>";
    const btnNext = document.createElement("button");
    btnNext.className = "btnNext";
    btnNext.innerHTML = "<i class='fa-solid fa-chevron-right'></i>";
    const btnClose = document.createElement("button");
    btnClose.className = "btnClose";
    btnClose.innerHTML = "<i class='fa-solid fa-xmark'></i>";
    btnNext.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        this._goToNext();
      }
    });
    btnNext.addEventListener("click", () => {
      this._goToNext();
    });
    btnPrev.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this._goToPrevious();
      }
    });
    btnPrev.addEventListener("click", () => {
      this._goToPrevious();
    });
    btnClose.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this._close();
      }
    });
    btnClose.addEventListener("click", () => {
      this._close();
    });
    this.#containerImg = document.createElement("div");
    this.#containerImg.className = "lightboxContainerImg";
    this.#title = document.createElement("span");
    this.#title.setAttribute("class", "title");
    const lightboxContent = document.createElement("div");
    lightboxContent.className = "lightboxContent";
    lightboxContent.append(
      this.#containerImg,
      btnPrev,
      btnNext,
      btnClose,
      this.#title
    );
    const lightboxContainer = document.createElement("div");
    lightboxContainer.className = "lightboxContainer";
    lightboxContainer.append(lightboxContent);
    this.#modal = document.createElement("dialog");
    this.#modal.setAttribute("aria-label", "image closeup view");
    this.#modal.setAttribute("id", "lightbox");
    this.#modal.setAttribute("open", true);
    this.#modal.append(lightboxContainer);
    body.append(this.#modal);
    this._displayItem(this.#currentIndex);
    body.style = "overflow: hidden;";
  }
  _close() {
    this.#modal.remove();
    const body = document.querySelector("body");
    body.style = "";
  }
  _goToNext() {
    this.#currentIndex++;
    if (this.#currentIndex >= this.#lightbox.length) {
      this.#currentIndex = 0;
    }
    this._displayItem(this.#currentIndex);
  }

  _goToPrevious() {
    this.#currentIndex--;
    if (this.#currentIndex < 0) {
      this.#currentIndex = this.#lightbox.length - 1;
    }
    this._displayItem(this.#currentIndex);
  }

  _displayItem(index) {
    const item = this.#lightbox[index];
    this.#title.textContent = item.title;
    let element;

    if (item.type === "IMG") {
      element = document.createElement("img");
      element.src = item.src;
      element.setAttribute("alt", item.title);
    } else if (item.type === "VIDEO") {
      element = document.createElement("video");
      const src = document.createElement("source");
      src.setAttribute("src", item.src);
      element.setAttribute("controls", "");
      element.append(src);
    }

    this.#containerImg.innerHTML = "";
    this.#containerImg.append(element);
    this.#currentIndex = index;
  }
  static init() {
    return new Lightbox();
  }
}
