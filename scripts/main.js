// базовые стили для уведомлений
let popup = document.querySelector(".popup-notification");
popup.style.top = 120 + "px";
popup.dataset.animating = false;

// функция для показа уведомлений
// если closable = true, то уведомление не закроется само, и нужно будет нажать на X
// в аргументе content может быть все что угодно, и его можно стилизовать под ваши нужды
function show_popup(closable, ...content) {
  if (popup.dataset.animating == "false") {
    popup.innerHTML = "";
    popup.append(...content);
    popup.style.right = getComputedStyle(
      document.querySelector(".center")
    ).marginRight;
    popup.dataset.animating = "true";
    if (closable) {
      let close_button = document.createElement("button");
      let img = document.createElement("img");
      img.src = "assets/notification-close.svg";
      close_button.append(img);
      close_button.style.background = "transparent";
      close_button.style.outline = "none";
      close_button.style.border = "none";
      popup.append(close_button);
      close_button.style.cursor = "pointer";
      close_button.addEventListener("click", () => {
        popup.style.right = "-100%";
        popup.dataset.animating = "false";
      });
      popup.style.paddingRight = "80px";
      popup.style.paddingTop = "25px";
      close_button.style.position = "absolute";
      close_button.style.top = "25px";
      close_button.style.right = "40px";
    } else {
      setTimeout(() => {
        popup.style.right = "-100%";
        popup.dataset.animating = "false";
      }, 3000);
    }
  }
}

// показ всей истории транзакций
let full_history_button = document.querySelector(".full-history");
full_history_button.addEventListener("click", () => {
  for (let content_block of document.querySelectorAll(".content-block")) {
    content_block.style.display = "none";
  }
  document.querySelector(".upper-row").style.display = "none";
  document.querySelector(".full-history-table").style.display = "block";
});

let back_button = document.querySelector(".full-history-exit");
back_button.addEventListener("click", () => {
  for (let content_block of document.querySelectorAll(".content-block")) {
    content_block.style.display = "";
  }
  document.querySelector(".upper-row").style.display = "";
  document.querySelector(".full-history-table").style.display = "";
});

// функционал для ползунка с ценой
let slider = document.querySelector(".sale-slider");
let slider_thumb = slider.querySelector(".sale-slider-thumb");
let max_value = 100; // можно поменять на нужную величину
let max_margin =
  slider.getBoundingClientRect().right -
  slider.getBoundingClientRect().left -
  slider_thumb.offsetWidth;
let right_darkening = slider.querySelector(".right-darkening");

let percentage = 0;

setInterval(() => {
  max_margin =
    slider.getBoundingClientRect().right -
    slider.getBoundingClientRect().left -
    slider_thumb.offsetWidth;

  right_darkening.style.width = `${100 - percentage * 100}%`;
  slider_thumb.style.left = percentage * max_margin + "px";
});
slider_thumb.onmousedown = (event) => {
  let initial = event.clientX - slider_thumb.getBoundingClientRect().left;
  let display_popup = false;
  let popup = slider_thumb.cloneNode(true);
  popup.style.className = "";
  popup.style.position = "absolute";
  popup.style.top = "-120px";
  popup.style.transform = "scale(1.1)";
  if (window.matchMedia("(max-width: 375px)").matches) {
    display_popup = true;
    slider.append(popup);
  }
  let move_listener = (event) => {
    max_margin =
      slider.getBoundingClientRect().right -
      slider.getBoundingClientRect().left -
      slider_thumb.offsetWidth;
    let relative_to_slider = Math.max(
      event.clientX - slider.getBoundingClientRect().left - initial,
      0
    );
    relative_to_slider = Math.min(max_margin, relative_to_slider);
    slider_thumb.style.left = relative_to_slider + "px";
    percentage = relative_to_slider / max_margin;
    right_darkening.style.width = max_margin - relative_to_slider + "px";
    slider_thumb.querySelector(".slider-thumb-value").innerHTML = Math.ceil(
      percentage * max_value
    );
    if (display_popup) {
      popup.innerHTML = slider_thumb.innerHTML;
      popup.style.left = relative_to_slider + "px";
    }
  };
  document.addEventListener("mousemove", move_listener);
  let mouse_up_listener = () => {
    document.removeEventListener("mousemove", move_listener);
    document.removeEventListener("mouseup", mouse_up_listener);
    popup.remove();
  };
  document.addEventListener("mouseup", mouse_up_listener);
};
