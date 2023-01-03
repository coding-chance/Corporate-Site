new WOW().init();
window.addEventListener("scroll", function(){
    var header = document.querySelector("nav");
    header.classList.toggle("scrolled", window.scrollY > 20);
})
$('#skills').waypoint(function() {
    $('.progress .progress-bar').each(function() {
        // .progress-bar クラスが付与された要素に対して width: "aria-valuenowの値%" と追記する。
        $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
}, { offset: '80%'} );
$('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1500
});
const filterizrOptions = { 
    
        animationDuration: 0.5,
        callbacks: {
            onInit: function() { },
            onFilteringStart: function() { },
            onFilteringEnd: function() { },
            onShufflingStart: function() { },
            onShufflingEnd: function() { },
            onSortingStart: function() { },
            onSortingEnd: function() { }
        },
        controlsSelector: '',
        delay: 0,
        delayMode: 'progressive',
        easing: 'ease-out',
        filter: 'all',
        filterOutCss: {
            opacity: 0,
            transform: 'scale(0.5)'
        },
        filterInCss: {
            opacity: 0,
            transform: 'scale(1)'
        },
        gridItemsSelector: '.filtr-item',
        gutterPixels: 0,
        layout: 'sameSize',
        multifilterLogicalOperator: 'or',
        searchTerm: '',
        setupControls: true,
        spinner: {
            enabled: false,
            fillColor: '#2184D0',
            styles: {
                height: '75px',
                margin: '0 auto',
                width: '75px',
                'z-index': 2,
            },
        },
};
$('.filter-container').filterizr({filterizrOptions});
const contactForm = document.querySelector(".contactForm");
const submitContactFormButton = document.getElementById("submitContactFormButton");
const contactFormLoader = document.getElementById("contactFormLoader");
submitContactFormButton.onclick = () => {
  const formData = new FormData(contactForm);
  const sendMessage = document.getElementById("sendMessage");
  const errorMessage = document.getElementById("errorMessage");
  const action = contactForm.getAttribute("action");
  const options = {
    method: 'POST',
    body: formData,
  }
  submitContactFormButton.style.display = "none";
  contactFormLoader.style.display = "block";
  if ( 
      contactForm.name.value === "" || contactForm.email.value === "" ||
      contactForm.subject.value === "" || contactForm.message.value === ""
    ) {
    alert('フォーム内に記入していない項目があります。\n空欄になっている箇所がないか確認してから、改めてフォームを送信してください。');
    submitContactFormButton.style.display = "inline";
    contactFormLoader.style.display = "none";
    return false;
  }
  fetch(action, options).then( (response) => {
    if( response.status === 200 ) {
        console.log("データの送信に成功しました。")
        sendMessage.style.display = "block";
        contactFormLoader.style.display = "none";
        contactForm.name.value = '';
        contactForm.email.value = '';
        contactForm.subject.value = '';
        contactForm.message.value = '';
        return;
    }
  }).catch( (error) => {
    console.log("[Contact Form] エラーが発生しました。");
    console.log(error);
    errorMessage.style.display = "block";
  })
  contactFormLoader.style.display = "none";
}
const newsLetterForm = document.querySelector(".newsLetterForm");
const sendNewsLetterFormMessage = document.getElementById("sendNewsLetterFormMessage");
const submitNewsLetterFormButton = document.getElementById("submitNewsLetterFormButton");
const newsLetterFormLoader = document.getElementById("newsLetterFormLoader");
submitNewsLetterFormButton.onclick = () => {
  if ( newsLetterForm.email.value === "" ) {
    alert('【メールマガジン購読登録用フォーム】\nメールアドレスが入力されていません。\n有効なメールアドレスが入力されているか確認してから、送信を押してください。');
    return false;
  }
  submitNewsLetterFormButton.style.display = "none";
  newsLetterFormLoader.style.display = "inline";
  const formData = new FormData(newsLetterForm);
  const action = newsLetterForm.getAttribute("action");
  const sendNewsLetterFormMessage = document.getElementById("sendNewsLetterFormMessage");
  const options = {
    method: 'POST',
    body: formData,
  }
  try {
    fetch(action, options).then( (response) => {
      console.log(response);
      if( response.status === 200 ) {
        console.log("[Contact Form] データの送信に成功しました。")
        sendNewsLetterFormMessage.style.display = "block";
        newsLetterForm.email.value = '';
        return;
      }
    }).catch( (error) => {
      console.log("エラー (メールマガジン登録処理)：");
      console.log(error);
      alert("エラー：\n\nメールマガジン登録に失敗しました。\n問い合わせフォームよりお申し込みください。");
      submitNewsLetterFormButton.style.display = "inline";
    })
  } catch (error) {
    console.log("[Contact Form]エラー: fetchに渡した引数に問題がある可能性があります。");
    console.log(error);
    alert("エラー：\n送信できませんでした。");
  }
  newsLetterFormLoader.style.display = "none";
}