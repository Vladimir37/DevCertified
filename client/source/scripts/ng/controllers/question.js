export default function ($scope, $stateParams, $state, $http) {
    $scope.selected_answer = null;
    $scope.loading = function () {
        $scope.solution = $stateParams;
    
        if (!$scope.solution.questions) {
            $state.go('index');
        }
    
        $scope.current_num = $scope.solution.answers.length + 1;
        $scope.max_num = $scope.solution.questions.length;
        var current_quest = $scope.solution.questions[$scope.solution.answers.length];
        $http({
            method: 'POST',
            url: '/api/get-question',
            data: {
                question: current_quest,
                test: $scope.solution.test,
                solution: $scope.solution._id
            }
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.quest_data = response.body;
            }
            else {
                console.log(response);
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
    $scope.sending = function () {
        console.log($scope.selected_answer);
    };
    
    $scope.loading();
}
