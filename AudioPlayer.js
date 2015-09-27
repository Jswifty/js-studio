/**  
 *	AudioPlayer.js is an object class which creates an instance of an HTML audio,
 *	as well as other objects such as audio context and analyser for analysing frequencies
 *	of the playing audio.
 *
 *  analyerEnabled indicates whether the audio player should enable analyser for frequency data recording.
 *	convolverEnabled indicates whether the audio player should enable convolver for convolution effects. 
 *
 *	Required: Animator.js
 */ 

var AudioPlayer = function(divContainer, anaylserEnabled, convolverEnabled) {
	
	/* Store the DIV container. */
	this.divContainer = divContainer;
	
	/* Create the audio object. */
	this.audioElement = document.createElement("audio");
	this.audioElement.innerHTML = "Your browser does not support the audio element.";
	
	/* Create the audio context. */
	this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	/** Set an path (URL or file path) as an audio source to the AudioPlayer. 
	 *	This creates a source element inside audio element. */
	this.setAudioSource = function (audioSource) {

		var extension = audioSource.substring(audioSource.lastIndexOf(".") + 1, audioSource.length);
		
		if (extension === "mp3" || extension === "ogg" || extension === "wav") {
		
			var source = document.createElement("source");
			source.src = audioSource;
			source.type = "audio/" + extension;
			
			this.audioElement.appendChild(source);
		}
	};
	
	/** Updates the array of frequency data from the analyser. 
	 *	This needs to be called to get the most recent data whilst the audio is playing. */
	this.updateFrequencyData = function () {
		if (this.analyser !== undefined && this.frequencyData !== undefined) {
			this.analyser.getByteFrequencyData(this.frequencyData);
		}
	};
	
	/** Updates the values from the convolver to create a convolution effect. */
	this.updateConvolutionEffect = function (sampleIndex, impulseResponseIndex, mainGain, sendGain) {
		// TODO
	};
	
	/** Set whether to display the audio player controller for navigation. */
	this.setShowController = function (showController) {
		if (showController === false) {
			this.audioElement.removeAttribute("controls");
		} else if (showController === true) {
			this.audioElement.setAttribute("controls", "controls");
		}
	};
	
	/** Start the audio. */
	this.start = function () {
	
		var audioElement = this.audioElement;
		
		/* If the readyState is HAVE_NOTHING, it means it's never started before.
		 * So don't have to reset the current time anyway. */
		if (audioElement.readyState !== 0) {
			audioElement.currentTime = 0;
		}
		
		audioElement.play();
	};

	/** Pause the audio. */
	this.pause = function () {
		if (this.audioElement.playing !== true) {
			this.audioElement.pause();
		}
	};

	/** Resume the audio. */
	this.resume = function () {
		if (this.audioElement.ended === false && this.audioElement.paused === true) {
			this.audioElement.play();
		}
	};

	/** Stop the audio. */
	this.stop = function () {
		this.audioElement.pause();
		this.audioElement.currentTime = 0;
	};
	
	/** Perform action for the animator pause event. */
	this.onAnimatorPaused = function () {
		if (this.audioElement.playing !== true && this.audioElement.paused === false) {
			this.audioElement.pause();
			this.pausedByAnimator = true;
		}
	};
	
	/** Perform action for the animator resume event. */
	this.onAnimatorResumed = function () {
		if (this.audioElement.ended !== true && this.audioElement.paused === true && this.pausedByAnimator === true) {
			this.audioElement.play();
			this.pausedByAnimator = false;
		}
	};
	
	/** Append an animator listener to the animator. */
	this.attachToAnimator = function (animator) {
	
		var audioPlayer = this;
		
		this.animatorListener = new AnimatorListener();
		this.animatorListener.onAnimatorPause = function () { audioPlayer.onAnimatorPaused(); }
		this.animatorListener.onAnimatorResume = function () { audioPlayer.onAnimatorResumed(); }
		
		animator.addAnimatorListener(this.animatorListener);
	};
	
	/** Disengage the animator listener from the animator. */
	this.detachFromAnimator = function (animator) {
		if (this.animatorListener !== undefined) {
			animator.removeAnimatorListener(this.animatorListener);
		}
	};
	
	/**** INITIALISATION ****/
	var audioPlayer = this;
	
	/* Append the audio element to the DIV container. */
	this.divContainer.appendChild(this.audioElement);
	
	/* Setup the analyser for this audio.
	 * This creates mediaElementSource, analyser and frequencyData in audioPlayer */
	if (anaylserEnabled === true) {
		
		var context = audioPlayer.audioContext;
		
		/* Create the media element source. */
		var source = audioPlayer.mediaElementSource = context.createMediaElementSource(audioPlayer.audioElement);
		
		/* Create the analyser from the audio context. */
		var analyser = audioPlayer.analyser = context.createAnalyser();
		
		/* Create an array of frequency data for recording.
		 * NOTE: frequencyBinCount tells you how many values you'll receive from the analyser. */
		audioPlayer.frequencyData = new Uint8Array(analyser.frequencyBinCount);
		
		/* Connect the source to the analyser. */
		source.connect(analyser);
		
		/* Connect the analyser to the context destination. */
		analyser.connect(context.destination);
	}
	
	/* Setup the convolver for this audio for creating convolution effects.
	 * This creates bufferSource, mainGainNode, sendGainNode, and convolver in audioPlayer */
	if (convolverEnabled === true) {
	
		var context = audioPlayer.audioContext;
		
		/* Create the buffer source from the audio context. */
		var source = audioPlayer.bufferSource = context.createBufferSource();
		
		/* Create the main gain node from the audio context. */
		var mainGainNode = audioPlayer.mainGainNode = context.createGain();
		mainGainNode.gain.value = 1.0;
		
		/* Create the send gain node from the audio context. */
		var sendGainNode = audioPlayer.sendGainNode = context.createGain();
		sendGainNode.gain.value = 2.0;
		
		/* Create the convolver from the audio context. */
		var convolver = audioPlayer.convolver = context.createConvolver();
		
		/* Connect the source to the main gain node. */
		source.connect(mainGainNode);
		
		/* Connect the main gain node to the context destination. */
		mainGainNode.connect(context.destination);
		
		/* Connect the source to the convolver. */
		source.connect(convolver);
		
		/* Connect the convolver to the send gain node. */
		convolver.connect(sendGainNode);
		
		/* Connect the send gain node to the context destination. */
		sendGainNode.connect(context.destination);
	}
};