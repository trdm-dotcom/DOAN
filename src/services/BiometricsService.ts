import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

const BiometricsType = {
  TouchID: 1,
  FaceID: 2,
  Biometrics: 3,
  NotSupported: -1,
};

// Check if biometrics is supported
const checkBiometricsSupport = () => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .isSensorAvailable()
      .then(resultObject => {
        const {available, biometryType} = resultObject;
        if (available && biometryType === BiometryTypes.TouchID) {
          resolve(BiometricsType.TouchID);
        } else if (available && biometryType === BiometryTypes.FaceID) {
          resolve(BiometricsType.FaceID);
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          resolve(BiometricsType.Biometrics);
        } else {
          resolve(BiometricsType.NotSupported);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Create biometrics keys
const createBiometricsKeys = () => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .createKeys()
      .then(resultObject => {
        const {publicKey} = resultObject;
        resolve(publicKey);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Check biometrics keys exist
const checkBiometricsKeysExist = () => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .biometricKeysExist()
      .then(resultObject => {
        const {keysExist} = resultObject;
        resolve(keysExist);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Delete biometrics keys
const deleteBiometricsKeys = () => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .deleteKeys()
      .then(resultObject => {
        const {keysDeleted} = resultObject;
        resolve(keysDeleted);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Signature
const createSignature = (promptMessage: string, payload: any) => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .createSignature({
        promptMessage: promptMessage,
        payload: payload,
      })
      .then(resultObject => {
        const {success, signature, error} = resultObject;
        resolve({success, signature, error});
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Prompt
const simplePrompt = (promptMessage: string, fallbackPromptMessage: string) => {
  return new Promise((resolve, reject) => {
    rnBiometrics
      .simplePrompt({
        promptMessage: promptMessage,
        fallbackPromptMessage: fallbackPromptMessage,
      })
      .then(resultObject => {
        const {success, error} = resultObject;
        resolve({success, error});
      })
      .catch(error => {
        reject(error);
      });
  });
};

export {
  BiometricsType,
  checkBiometricsSupport,
  createBiometricsKeys,
  checkBiometricsKeysExist,
  deleteBiometricsKeys,
  createSignature,
  simplePrompt,
};
