export default function ($scope, $stateParams, $http) {
    $scope.solution = $stateParams;
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
    console.log($scope.quest);
}
