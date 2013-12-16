const eMediaDirective = (eMediaService)->
	restrict: 'AE'
	replace: true
	transclude: true
	template: '<video class="camera" autoplay="" /><div ng-transclude></div>',
 
	link: !(scope, elem, attrs) ->
		_w = Number(attrs.width.replace('px'))
		_h = Number(attrs.height.replace('px'))
		success = (stream)!->
			if(navigator.mozGetUserMedia) 
				videoElement.mozSrcObject = stream
			else
				vendorURL = window.URL || window.webkitURL
				videoElement.src = window.URL.createObjectURL(stream)
				
			videoElement.play()
		error = (err)!->
			console.log(err)

		if (!eMediaService.hasUserMedia)
			false 
		else 
			userMedia = eMediaService.getUserMedia()
			videoElement = document.querySelector('video')
			console.log(videoElement);

			navigator.getUserMedia({
				video:
					mandatory:
						maxHeight:_h
						maxWidth:_w
				audio: true
			},success, error
			)

const eMediaService = <[$window]> ++ ($window) ->
	const hasUserMedia = ->
		!!getUserMedia()

	const getUserMedia =  ->
		navigator.getUserMedia = ($window.navigator.getUserMedia || $window.navigator.webkitGetUserMedia || $window.navigator.mozGetUserMedia ||  $window.navigator.msGetUserMedia)
	{
		hasUserMedia: hasUserMedia()
		getUserMedia: getUserMedia
	}

angular.module 'emily' <[]>
	.factory 'eMediaService' eMediaService
	.directive 'eMedia' eMediaDirective

