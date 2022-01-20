// 올레tv X 초등 홈스쿨에서 사용할 유틸리티 함수 모음
const __kt__ = {
	// sessionStorage wrapper
	session: {
		getEncryptKeys: function() {
			return [
				"SAID"
			];
		},
		put: function(key, value) {
			var data = "";

			if(this.getEncryptKeys().includes(key))
				data = CryptoJS.AES.encrypt(value, Global.withCd).toString();
			else
				data = value;

			sessionStorage.setItem(key, data);
		},
		get: function(key) {
			var value = sessionStorage.getItem(key);

			if(!value) return value;

			var data = "";

			if(this.getEncryptKeys().includes(key)) {
				data = CryptoJS.AES.decrypt(value, Global.withCd).toString(CryptoJS.enc.Utf8);
			} else {
				data = value;
			}

			return data;
		}
	},
	// cipher wrapper (나중에 삭제)
	cipher: {
		enc: function(value) {
			value = "" + value;
			return CryptoJS.AES.encrypt(value, Global.withCd).toString();
		},
		dec: function(encryptData) {
			var key = Global.withCd.substring(0,16);
            var base64 = btoa(key);
            var decrypt = CryptoJS.AES.decrypt(encryptData, CryptoJS.enc.Base64.parse(base64), {
            	mode: CryptoJS.mode.ECB,
            	padding: CryptoJS.pad.Pkcs7
          	});
            		
			return decrypt.toString(CryptoJS.enc.Utf8);
//			return CryptoJS.AES.decrypt(encryptData, Global.withCd).toString(CryptoJS.enc.Utf8);
		}
	}
}

const kt = Object.freeze(__kt__);