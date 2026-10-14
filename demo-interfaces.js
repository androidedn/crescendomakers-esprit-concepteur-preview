/* Démonstration locale : aucune requête réseau, aucun stockage des champs. */
(function(){
  "use strict";
  const backTop = document.querySelector(".v5-back-to-top");
  if(backTop){
    backTop.classList.add("v5-back-to-top--floating");
    const updateBackTop=()=>{backTop.hidden=window.scrollY<Math.max(window.innerHeight,640);};
    let backTopScheduled=false;
    window.addEventListener("scroll",()=>{
      if(backTopScheduled)return;
      backTopScheduled=true;
      window.requestAnimationFrame(()=>{updateBackTop();backTopScheduled=false;});
    },{passive:true});
    window.addEventListener("resize",updateBackTop);
    backTop.addEventListener("click",()=>document.body.focus({preventScroll:true}));
    updateBackTop();
  }
  const newsletter = document.querySelector("#newsletter-demo");
  if(newsletter){
    const nickname=newsletter.querySelector("[name=nickname]");
    const validateNickname=()=>nickname.setCustomValidity(nickname.value.trim()?"":"Indique ton prénom ou ton pseudo.");
    nickname.addEventListener("input",validateNickname);
    newsletter.addEventListener("submit", event => {
      event.preventDefault();
      const status=document.querySelector("#newsletter-demo-status");
      nickname.value=nickname.value.trim();
      validateNickname();
      if(!newsletter.reportValidity())return;
      if(!newsletter.querySelector("[name=infos]").checked&&!newsletter.querySelector("[name=tips]").checked){
        status.textContent="Choisis au moins un type d’e-mail pour tester cette inscription.";return;
      }
      status.textContent="Démonstration terminée : aucune inscription n’a été créée, aucun e-mail n’a été envoyé et tes champs n’ont pas été transmis ni enregistrés. Le service doit être raccordé avant de pouvoir s’inscrire réellement.";
      newsletter.reset();
    });
  }
  const form=document.querySelector("#commande-demo");
  if(!form)return;
  form.addEventListener("submit",event=>event.preventDefault());
  const early=document.querySelector("#early-consents");
  const beneficiary=document.querySelector("#beneficiary-fields");
  const status=document.querySelector("#payment-demo-status");
  const setGroup=(group,active)=>{
    group.hidden=!active;
    group.querySelectorAll("input").forEach(input=>{
      input.disabled=!active;
      if(!active){if(input.type==="checkbox")input.checked=false;else input.value="";}
    });
  };
  const update=()=>{
    setGroup(early,form.querySelector("[name=access]:checked")?.value==="early");
    setGroup(beneficiary,form.querySelector("[name=buyer]:checked")?.value==="other");
    status.textContent="";
  };
  form.addEventListener("change",update);
  update();
  form.querySelectorAll("[data-payment-demo]").forEach(button=>button.addEventListener("click",()=>{
    if(!form.reportValidity())return;
    const method=button.dataset.paymentDemo;
    const access=form.querySelector("[name=access]:checked").value==="early"?"accès anticipé demandé":"accès après le délai légal choisi";
    status.textContent="Choix "+method+" simulé — "+access+". Aucun paiement n’a été effectué, aucune commande n’a été passée et aucun compte n’a été créé. Aucun champ n’a été transmis ni conservé. Dans le parcours réel, la validation du paiement devra être suivie d’une confirmation sur support durable et de l’ouverture de l’accès selon les conditions applicables.";
    status.focus();
  }));
})();
