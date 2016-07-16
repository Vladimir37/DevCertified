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
                console.log(response.body);
                console.log({
                    question: current_quest,
                    test: $scope.solution.test,
                    solution: $scope.solution._id
                });
                $scope.error = 'Server error';
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
    $scope.sending = function () {
        $scope.solution = $stateParams;

        if (!$scope.solution.questions) {
            $state.go('index');
        }
        if (!$scope.selected_answer) {
            return false;
        }
    
        $scope.current_num = $scope.solution.answers.length + 1;
        $scope.max_num = $scope.solution.questions.length;
        var current_quest = $scope.solution.questions[$scope.solution.answers.length];

        $http({
            method: 'POST',
            url: '/api/take-answer',
            data: {
                question: current_quest,
                test: $scope.solution.test,
                solution: $scope.solution._id,
                answer_num: $scope.selected_answer
            }
        }).then(function (response) {
            response = response.data;
            if (response.status == 0 && !response.body) {
                $scope.solution.answers.push($scope.selected_answer);
                $state.go('question', $scope.solution, {
                    reload: true
                });
            }
            else if (response.status == 0) {
                $state.go('finish', response.body);
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
    
    $scope.loading();
}
