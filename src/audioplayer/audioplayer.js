
define([
	"../animator/animatorlistener"
], function (AnimatorListener) {

	return function (container, anaylserEnabled, convolverEnabled) {
		
		var audioPlayer = this;
		
		/* Store the container. */
		this.container = container;
		
		/* Create the audio object. */
		this.audioElement = document.createElement("audio");
		this.audioElement.style.position = "absolute";
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
				
				audioPlayer.audioElement.appendChild(source);
			}
		};
		
		/** Updates the array of frequency data from the analyser. 
		 *	This needs to be called to get the most recent data whilst the audio is playing. */
		this.updateFrequencyData = function () {
			if (audioPlayer.analyser && audioPlayer.frequencyData) {
				audioPlayer.analyser.getByteFrequencyData(audioPlayer.frequencyData);
			}
		};
		
		/** Updates the values from the convolver to create a convolution effect. */
		this.updateConvolutionEffect = function (sampleIndex, impulseResponseIndex, mainGain, sendGain) {
			// TODO
		};
		
		/** Set whether to display the audio player controller for navigation. */
		this.setShowController = function (showController) {
			if (showController === false) {
				audioPlayer.audioElement.removeAttribute("controls");
			} else if (showController === true) {
				audioPlayer.audioElement.setAttribute("controls", "controls");
			}
		};
		
		/** Start the audio. */
		this.start = function () {

			/* If the readyState is HAVE_NOTHING, it means it's never started before.
			 * So don't have to reset the current time anyway. */
			if (audioPlayer.audioElement.readyState !== 0) {
				audioPlayer.audioElement.currentTime = 0;
			}
			
			audioPlayer.audioElement.play();
		};

		/** Pause the audio. */
		this.pause = function () {
			if (audioPlayer.audioElement.playing !== true) {
				audioPlayer.audioElement.pause();
			}
		};

		/** Resume the audio. */
		this.resume = function () {
			if (audioPlayer.audioElement.ended === false && audioPlayer.audioElement.paused === true) {
				audioPlayer.audioElement.play();
			}
		};

		/** Stop the audio. */
		this.stop = function () {
			audioPlayer.audioElement.pause();
			audioPlayer.audioElement.currentTime = 0;
		};
		
		/** Perform action for the animator pause event. */
		this.onAnimatorPaused = function () {
			if (audioPlayer.audioElement.playing !== true && audioPlayer.audioElement.paused === false) {
				audioPlayer.audioElement.pause();
				audioPlayer.pausedByAnimator = true;
			}
		};
		
		/** Perform action for the animator resume event. */
		this.onAnimatorResumed = function () {
			if (audioPlayer.audioElement.ended !== true && audioPlayer.audioElement.paused === true && audioPlayer.pausedByAnimator === true) {
				audioPlayer.audioElement.play();
				audioPlayer.pausedByAnimator = false;
			}
		};
		
		/** Append an animator listener to the animator. */
		this.attachToAnimator = function (animator) {
			if (animator !== undefined && animator.addAnimatorListener !== undefined) {
				audioPlayer.animatorListener = new AnimatorListener(audioPlayer.onAnimatorPaused, audioPlayer.onAnimatorResumed);
				animator.addAnimatorListener(audioPlayer.animatorListener);
			}
		};
		
		/** Disengage the animator listener from the animator. */
		this.detachFromAnimator = function (animator) {
			if (audioPlayer.animatorListener !== undefined && animator !== undefined && animator.removeAnimatorListener !== undefined) {
				animator.removeAnimatorListener(audioPlayer.animatorListener);
			}
		};
		
		/* Append the audio element to the DIV container. */
		this.container.appendChild(this.audioElement);
		
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
});
