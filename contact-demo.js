/* Démonstration uniquement : aucun envoi, stockage ou appel tiers. */
(function(){
  "use strict";
  const form=document.querySelector("#contact-demo");
  if(!form)return;
  const request=form.querySelector("[name=phone-request]");
  const group=document.querySelector("#phone-field");
  const phone=form.querySelector("[name=phone]");
  const nickname=form.querySelector("[name=nickname]");
  const message=form.querySelector("[name=message]");
  function syncPhone(){
    group.hidden=!request.checked;
    phone.disabled=!request.checked;
    phone.required=request.checked;
    request.setAttribute("aria-expanded",String(request.checked));
    if(!request.checked)phone.value="";
  }
  request.addEventListener("change",syncPhone);
  [nickname,message].forEach(input=>input.addEventListener("input",()=>input.setCustomValidity(input.value.trim()?"":"Merci de compléter ce champ.")));
  form.addEventListener("submit",event=>{
    event.preventDefault();
    [nickname,message].forEach(input=>input.setCustomValidity(input.value.trim()?"":"Merci de compléter ce champ."));
    if(!form.reportValidity())return;
    const status=document.querySelector("#contact-status");
    status.textContent="Test terminé : aucun message n’a été envoyé, aucun rendez-vous n’a été demandé et aucune inscription commerciale n’a été créée. Les champs n’ont pas été transmis ni enregistrés.";
    form.reset();
    syncPhone();
    status.focus();
  });
  syncPhone();
})();
