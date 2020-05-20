const isValidDomain = require('is-valid-domain')


savePrefs = () => {
    const customDomains = document.getElementById("field-custom-domains").value;
    const invalidDomains = [];
    const validDomains = [];
    customDomains.split(',').forEach(domain => {
        if(domain.trim() && isValidDomain(domain, {subdomain : true, wildcard: false})){
            validDomains.push(domain);
        }else{
            if(domain.trim()){
                invalidDomains.push(domain);
            }
        }
    });
    if(invalidDomains.length){

    }else{
        saveDomains(validDomains);
    }
}

