ctrl.controller('StepCtrl', ['$scope', function($scope){
    $scope.$on('changePos', function(evt, val){
        $scope.step = val;
    })

}])
ctrl.directive('stepper', function($document){
    return {
        restrict: 'AE',
        template: '<style>.stepper-box{width:600px;height:20px;background:#f5f5f5;text-align:left;}.step-progress{float:left;height:20px;background:blue}.step-progress ~ button{padding:10px;position:absolute}</style><div class="stepper-box">' +
            '<div class="step-progress" ng-style="currentPos()"></div><button ng-click="currentPos()"></button></div>',
        controller: function($scope){
            $scope.currentStep = 0;
            $scope.maxStep = 0;

            $scope.changePos = function(val) {
                if (val >= 0 && val <= $scope.maxStep && val !== $scope.currentStep) {
                    $scope.currentStep = val;
                    $scope.$emit('changePos', val);
                }
            }
        },
        link: function(scope, ele, attrs){

            scope.maxStep = attrs['maxstep'] || 10;

            var allWidth = ele.children()[1].offsetWidth;
            attrs.$observe('currentstep', function(val){
                scope.currentStep = val || 10;

            })
            scope.currentPos = function(val){
                return {width: scope.currentStep * 100 / scope.maxStep + '%'};
            }
            scope.currentStep = 2;
            ele.on('click', function(evt){
                var targer = evt.target;
                if (targer.nodeName.toLowerCase() == 'button') return;
                var clickL = evt.offsetX || evt.layerX;

                scope.$apply(function(){
                    scope.changePos(Math.round(clickL / allWidth * scope.maxStep))
                })

            })
            var oButton = ele.find('button');
            var oProgress = ele.children().find('div');
            var value;
            var dragging;
            oButton.on('mousedown', function(evt){
                dragging = true;
                ele.on('mousemove', function(evt){
                    if (dragging) {
                        var mouseL = evt.clientX - ele[0].getBoundingClientRect().left;
                        var temp = Math.round(mouseL / allWidth * scope.maxStep);

                        if (temp >= 0 && temp <= scope.maxStep) {
                            oProgress.css('width', mouseL + 'px');
                            value = temp;
                        }
                    }
                });
                $document.on('mouseup', function(){
                    if (dragging) {
                        scope.changePos(value);
                        scope.$digest();
                    }
                    dragging = false;
                })
                evt.preventDefault();
            })
        }
    }
})