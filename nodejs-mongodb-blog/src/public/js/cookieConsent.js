import {
    html,
    render,
    useState,
  } from "https://unpkg.com/htm/preact/standalone.module.js";
  import { LangData } from "./newLangData.js";
  import Preferences from "./Preferences.js";
  
  const Popupsmart_CookiePopup = ({ closePopup, params }) => {
    /*The default configuration of consents are made for gdpr , 
      if the actual consent is e-privacy, fix the consents for it.
      */
    const EPrivacyHandler = () => {
      if (params["consent_type"] === "e-privacy") {
        window.popupsmart_current_consents = {
          "strictly-necessary": true,
          "functionality": true,
          "tracking": true,
          "targeting-advertising": true,
        };
      }
    };
    EPrivacyHandler();
  
    const [isPrefOpen, setIsPrefOpen] = useState(false);
    //we have a state for consents to not manipulate global consents directly
    //and only manipulate when preferences are saved
  
    //open/close preferences
    const openClosePref = () => {
      setIsPrefOpen(!isPrefOpen);
    };
    //current language
    const [currentLang, setCurrentLang] = useState(params["language"]);
    const changeLanguage = (newLang) => {
      setCurrentLang(newLang);
    };
  
    const theme = params["palette"];
    const companyLogoURL = params["companyLogoURL"];
    const mainStyle = params["notice_banner_type"];
    const consentType = params["consent_type"];
  
    let innerWidth = window.innerWidth;
  
    //apply only on head-dialog style
    let headDialogStyle;
    let headDialogRaw = `
          top:0;
          width:100%;
          align-items:start;
          height:max-content;
          right:0;
      `;
  
    
    //apply only on bottom dialog style
    let bottomDialogStyle;
    let bottomDialogRaw = `
          bottom:0;
          width:100%;
          align-items:start;
          height:max-content;
          right:0;
      `;
  
  
    if (innerWidth < 576) {
         headDialogStyle=headDialogRaw + 'padding:2rem 10% 2rem 25%';
         bottomDialogStyle=bottomDialogRaw + 'padding:2rem 10% 2rem 25%';  
      }
    else{
      headDialogStyle=headDialogRaw + 'padding:3.75rem 25% 3.75rem 20%';
         bottomDialogStyle=bottomDialogRaw + 'padding:3.75rem 25% 3.75rem 20%';
    }
    //only apply overlay when the style is "popup"
    const popupOverlayStyle = `
      position:fixed;
      width:100%;
      height:100vh;
      top:0;
      right:0;
      background-color:black;
      opacity:0.5;
      z-index:99995;
      `;
  
    
    let buttonWrapperStyle = `
      flex-flow:row nowrap;
      `;
    let buttonVerticalStyle =`
    width:100%;
    padding:1rem;
    `
    
    if (innerWidth < 800) {
      if (mainStyle === "head-dialog" || mainStyle === "bottom-dialog") {
        buttonWrapperStyle = `
              flex-flow:column nowrap;
              `;
      }
    }
    //only on popup style
    const buttonWrapperPopupStyle = `
      min-width:50%;
      width:max-content;
      `;
    
    let standaloneRawStyle = `
      top:calc(50% - 13.875rem);
          width:90%;
          right:5%;
          height:24rem;
          padding:1rem;
      
      `;
    //standaloneStyle will be applied only on style="popup"
    let standaloneStyle;
  
    if (innerWidth > 1200) {
      standaloneStyle =
        standaloneRawStyle +
        `
          width:60rem;        
          height:30rem;
          top:calc(50% - 18rem);
          right:calc(50% - 30rem);
          padding:3.75rem 6rem 3.75rem 6rem;
          `;
    } else if (innerWidth > 800) {
      standaloneStyle =
        standaloneRawStyle +
        `
          padding:3.75rem 6rem 3.75rem 6rem;
          `;
    }
    else if(576<innerWidth && innerWidth<800){
      standaloneStyle =
        standaloneRawStyle +
        `
          padding:2.75rem 4.5rem 2.75rem 4.5rem;
          `;
    }
  
    else if (innerWidth < 576) {
      standaloneStyle = standaloneRawStyle;
    }
  
    let popupShadow;
    if (mainStyle === "head-dialog") {
      popupShadow = "box-shadow: 0px 3px 6px #00000029;";
    } else if (mainStyle === "bottom-dialog") {
      popupShadow = "box-shadow: 0px -10px 6px #0000001A;";
    } else if (mainStyle === "simple-dialog") {
      popupShadow = "box-shadow: 0px 20px 50px #00000029;";
    } else if (mainStyle === "popup") {
      popupShadow = "box-shadow: 0px 20px 50px #00000029;";
    }
  
    return html`
      <div>
      <div style="
      ${mainStyle === "popup" ? popupOverlayStyle : null}
      ">
      </div>
              <div class="
              ${innerWidth > 1200 && mainStyle === "simple-dialog"
        ? "forSimpleSize "
        : " "
      }
              popup__wrapper" 
              style="
              color:${theme === "dark" ? "white" : "black"};
              background-color:${theme === "dark" ? "black" : "#f2f2f2"};
              border:none;
              ${popupShadow};
              ${mainStyle === "head-dialog" ? headDialogStyle : null};
              ${mainStyle === "bottom-dialog" ? bottomDialogStyle : null};
              ${mainStyle === "popup" ? standaloneStyle : null};
              
              ">
              <div class="
              ${mainStyle === "head-dialog" || mainStyle === "bottom-dialog"
        ? "popup__title__wrapper"
        : " "
      }
              ">
              <img 
              class="popup__logo ${mainStyle === "simple-dialog" || mainStyle === "popup"
        ? "forSimpleLogo"
        : " "
      }
              "
              src="${companyLogoURL
        ? companyLogoURL
        : "https://cookieconsent.popupsmart.com/js/Assets/defaultLogo.svg"
        //"/Assets/defaultLogo.svg"
      }"
              
              />
              <div class="popup__title">
                  ${LangData[currentLang]["consent_title"]} 
                  </div>
              </div>
                  
                  
                  <p class="popup__content">
                  ${LangData[currentLang]["consent_text"]}  
                  </p>
                  <div 
                  class="button__wrapper"
                  style="
                  ${mainStyle === "head-dialog" || mainStyle === "bottom-dialog"
        ? buttonWrapperStyle
        : null
      };
                  ${mainStyle === "popup" ? buttonWrapperPopupStyle : null};
                  "
                  >
                      <button 
                      class="button"
                      onClick=${closePopup}
                      name="agree_cookie_consent"
                      style="
              color:${theme === "dark" ? "black" : "white"};
              background-color:${theme === "dark" ? "white" : "black"};
              font-weight:"bold";
              ${mainStyle === "popup" || mainStyle === "simple-dialog"
              ? buttonVerticalStyle
              : null
            };
      }
              "
                      >
                      ${LangData[currentLang]["consent_agree"]} 
                      </button>
                      ${consentType === "gdpr"
        ? html`
                  <button 
                      class="button"
                      onClick=${closePopup}
                      name="reject_cookie_consent"
                      style="
              color:${theme === "dark" ? "black" : "white"};
              background-color:${theme === "dark" ? "white" : "black"};
              font-weight:"bold";
              ${mainStyle === "popup" || mainStyle === "simple-dialog"
              ? buttonVerticalStyle
              : null
            };
              "
                      >
                      ${LangData[currentLang]["consent_reject"]} 
                      </button>
                  `
        : null
      }
                      <button
                      style="
              color:${theme === "dark" ? "white" : "black"};
              background-color:${theme === "dark" ? "black" : "white"};
              border:${theme === "dark" ? "1px solid white" : "1px solid #aaaaaa"};
              font-weight:"bold";
              ${mainStyle === "popup" || mainStyle === "simple-dialog"
              ? buttonVerticalStyle
              : null
            };
              "
                       onClick=${openClosePref} 
                      class="button prefButton">
                      <img 
                      src="${theme === "dark"
        ? "https://cookieconsent.popupsmart.com/js/Assets/gearForDark.svg"
        : "https://cookieconsent.popupsmart.com/js/Assets/gearForLight.svg"
      }"
                      />
                      ${LangData[currentLang]["change_preferences"]} 
                      </button>
                  </div>
              </div>
              ${isPrefOpen
        ? html` <${Preferences}
                      params=${params}
                      openClosePref=${openClosePref}
                      changeLanguage=${changeLanguage}
                      currentLang=${currentLang}
                    />`
        : null
      }
          </div>
      `;
  };
  
  //this is a global starter function
  window.popupsmart_cookie_consent_start = (params) => {
    const div = document.createElement("div");
    div.id = "popupsmart_cookie_consent_gdpr_root";
    document.body.appendChild(div);
  
    let shadow = div.attachShadow({ mode: "open" });
    let head = document.createElement("head");
    head.id = "head";
    shadow.appendChild(head);
  
    let cssRuleFile = "https://cookieconsent.popupsmart.com/js/App.css";
    //let cssRuleFile = "/App.css";
    let cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("type", "text/css");
    cssLink.setAttribute("href", cssRuleFile);
    cssLink.id = "css";
    head.appendChild(cssLink);
  
    /*when agreed, all consents are accepted
    when rejected, only strictly-necessary accepted
    the closePopup function is passed to both I agree 
    and I reject buttons as event handler*/
    function closePopup(e) {
      const name = e.target.name;
  
      let consents = { ...window.popupsmart_current_consents };
      //on reject, set everything else false than strictly
      if (name === "reject_cookie_consent") {
        consents["strictly-necessary"] = true;
        consents["functionality"] = false;
        consents["tracking"] = false;
        consents["targeting-advertising"] = false;
        window.popupsmart_current_consents = { ...consents };
      } 
      window.popupsmart_change_script_types();
      //remove root div, this div also includes shadow root.
      const div = document.getElementById("popupsmart_cookie_consent_gdpr_root");
      div.remove();
    }
    const Render = () => {
      render(
        html`<${Popupsmart_CookiePopup}
          params=${params}
          closePopup=${closePopup}
        />`,
        shadow
      );
    };
  
    const waitForCSS = (callback) => {
      let css = shadow.getElementById("css");
      css.addEventListener("load", () => {
        callback();
      });
    };
    waitForCSS(Render);
  };
  
  //this is a global starter function
  window.popupsmart_cookie_consent_open_preferences_center = (paramObj) => {
    const mountElementId = paramObj.mountElementId;
    const params = paramObj.params;
  
    const mountElement = document.getElementById(mountElementId);
    const mountElementChild = document.createElement("div");
    mountElement.appendChild(mountElementChild);
  
    let shadow = mountElementChild.attachShadow({ mode: "open" });
    let head = document.createElement("head");
    head.id = "head";
    shadow.appendChild(head);
  
    let cssRuleFile = "https://cookieconsent.popupsmart.com/js/App.css";
    //let cssRuleFile = "/App.css";
    let cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("type", "text/css");
    cssLink.setAttribute("href", cssRuleFile);
    head.appendChild(cssLink);
  
    function closePreferences() {
      mountElementChild.remove();
    }
  
    mountElement.addEventListener("click", () => {
      render(
        html`<${Preferences}
          params=${params}
          openClosePref=${closePreferences}
          fromId="{true}"
        />`,
        shadow
      );
    });
  };