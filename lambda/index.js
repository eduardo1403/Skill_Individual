/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

var persistenceAdapter = getPersistenceAdapter();


function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'user_mail_table';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const languageStrings = require('./languageStrings')

const DOCUMENT_ID = "BienvenidaTemp";
const DOCUMENT_ID4 = "AdiosTemp";
const DOCUMENT_ID2 = "HolaTemp";
const DOCUMENT_ID3 = "Ayuda";
const DOCUMENT_ID5 = "ErrorTemp";
const DOCUMENT_ID6 = "Catalogo";
const DOCUMENT_ID7 = "DonaC";

const datasource7 = {
    "alexaDetailData": {
        "backgroundImage": "https://static.videezy.com/system/resources/thumbnails/000/036/358/original/donut.jpg",
        "title": "Dona de Chocolate",
        "detailImage": "https://alsuper.online/products/404724_p.png",
        "textContent": {
            "primaryText": "La dona de chocolate es de las más vendidas y más valoradas del sitio, para seguir con la compra accede al sitio, https://www.krispykreme.mx/donas-y-bebidas/dona-chocomania-carlos-v/"
        },
        "logoUrl": "https://static.vecteezy.com/system/resources/previews/012/025/572/original/the-pink-donut-png.png"
    }
};


const datasource6 = {
    "imageListData": {
        "headerTitle": "Tienda buenas donas",
        "headerLogo": "https://static.vecteezy.com/system/resources/previews/012/025/572/original/the-pink-donut-png.png",
        "headerSubtitle": "Header subtitle",
        "headerAttributionImage": "https://static.vecteezy.com/system/resources/previews/012/025/572/original/the-pink-donut-png.png",
        "backgroundImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/BT6_Background.png",
        "defaultImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/BT7_Background.png",
        "hintText": "Alexa image list footer hint text",
        "listItemsToShow": [
            {
                "primaryText": "Dona de azucar",
                "secondaryText": "$40 MX",
                "imageSource": "https://pasteleriaalcazar.mx/wp-content/uploads/2013/06/dona_azucar.png",
                "imageShowProgressBar": false,
                "ratingSlotMode": "multiple",
                "ratingNumber": 2.87
            },
            {
                "primaryText": "Dona de chocolate",
                "secondaryText": "$50 MX",
                "tertiaryText": "Tertiary text",
                "imageSource": "https://alsuper.online/products/404724_p.png",
                "ratingSlotMode": "multiple",
                "ratingNumber": 4.5
            },
            {
                "primaryText": "Dona de fresa",
                "secondaryText": "$35 MX",
                "ratingSlotMode": "multiple",
                "imageSource": "https://ailubeik.com/wp-content/uploads/2020/04/dona-gragea.png",
                "ratingNumber": 2
            }
        ]
    }
};


const datasource5 = {
    "backgroundImageExampleData": {
        "imageSource": "https://media.istockphoto.com/id/1051085898/es/vector/c%C3%ADrculo-de-donuts-de-colores-aislados-sobre-fondo-blanco-colecci%C3%B3n-de-donas-en-esmalte-para.jpg?s=1024x1024&w=is&k=20&c=_3Ygs5HIRYL56ll0YSALsbqhCTJAaI05aZ1vw5hQLdQ="
    }
};
const datasource3 = {
    "backgroundImageExampleData": {
        "imageSource": "https://media.istockphoto.com/id/1051085898/es/vector/c%C3%ADrculo-de-donuts-de-colores-aislados-sobre-fondo-blanco-colecci%C3%B3n-de-donas-en-esmalte-para.jpg?s=1024x1024&w=is&k=20&c=_3Ygs5HIRYL56ll0YSALsbqhCTJAaI05aZ1vw5hQLdQ="
    }
};

const datasource2 = {
    "backgroundImageExampleData": {
        "imageSource": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPsAAADJCAMAAADSHrQyAAAAA1BMVEW1ZtNIkk5uAAAASElEQVR4nO3BMQEAAADCoPVPbQlPoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+BsXcAAGLPH6gAAAAAElFTkSuQmCC"
    }
};

const datasource4 = {
    "backgroundImageExampleData": {
        "imageSource": "https://fondosmil.com/fondo/28088.jpg"
    }
};



const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CatalogoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CatalogoIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Puedes consultar el sitio web para comprar y ver más donas, desliza en la pantalla pantalla para ver mas sabores";
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID6, datasource6);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


//StockIntent


const StockIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StockIntent';
    },
    handle(handlerInput) {
        
        const sabor = handlerInput.requestEnvelope.request.intent.slots.dona.value;
        
        const title1 = 'Dona de Chocolate';
        const img1 = 'https://alsuper.online/products/404724_p.png';
        const priT = 'La dona de chocolate es de las más vendidas y más valoradas del sitio, para seguir con la compra accede al sitio, https://www.krispykreme.mx/donas-y-bebidas/dona-chocomania-carlos-v/'
        
        const title2 = 'Dona de Fresa';
        const img2 = 'https://ailubeik.com/wp-content/uploads/2020/04/dona-gragea.png';
        const priT2 = 'La dona de fresa es una popular para los amantes del glaseado, para seguir con la compra accede al sitio, https://www.krispykreme.mx/donas-y-bebidas/dona-glaseado-sabor-fresa/';
        
        const title3 = 'Dona de Azucar';
        const img3 = 'https://pasteleriaalcazar.mx/wp-content/uploads/2013/06/dona_azucar.png';
        const priT3 = 'La dona de azucar ';
        
        if(sabor === 'chocolate'){
            var speakOutput = 'Has elejido la de chocolate';
            
            datasource7.alexaDetailData.title = title1;
            datasource7.alexaDetailData.detailImage = img1;
            datasource7.alexaDetailData.textContent.primaryText = priT

            // Crear la directiva APL con el nuevo datasource
            const aplDirective = createDirectivePayload(DOCUMENT_ID7, datasource7);
            
            // Agrega la directiva APL a la respuesta
            handlerInput.responseBuilder.addDirective(aplDirective);
            
        }else if(sabor === 'fresa'){
            
            speakOutput = 'Has elejido la de fresa';
            
            datasource7.alexaDetailData.title = title2;
            datasource7.alexaDetailData.detailImage = img2;
            datasource7.alexaDetailData.textContent.primaryText = priT2

            // Crear la directiva APL con el nuevo datasource
            const aplDirective = createDirectivePayload(DOCUMENT_ID7, datasource7);
            
            // Agrega la directiva APL a la respuesta
            handlerInput.responseBuilder.addDirective(aplDirective);
            
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        const speakOutput =requestAttributes.t('HELP_MESSAGE');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID3, datasource3);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');
        
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID4, datasource4);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput =  requestAttributes.t('FALLBACK_MESSAGE');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
 const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t(`REFLECTOR_MESSAGE, ${intentName}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speechText = requestAttributes.t('ERROR_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
}

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CatalogoIntentHandler,
        StockIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
            LocalizationInterceptor,
            LoggingRequestInterceptor,
            LoadAttributesRequestInterceptor)
        .addResponseInterceptors(
            LoggingResponseInterceptor,
            SaveAttributesResponseInterceptor)
        .withPersistenceAdapter(persistenceAdapter)
    .lambda();