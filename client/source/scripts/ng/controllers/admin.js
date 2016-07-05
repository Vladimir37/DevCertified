export default function($scope, $http) {
    $scope.selected_data = {};
    $scope.question_data = {};
    $scope.active = {};
    $scope.allow_code = {
        create: false,
        edit: false
    };
    $scope.select_edit_test = function () {
        if (!$scope.selected_data.edit_test) {
            $scope.error = 'Test is not selected';
        }
        $scope.active.edit_test = $scope.tests[$scope.selected_data.edit_test];
    };
    $scope.select_image_test = function () {
        if (!$scope.selected_data.image_test) {
            $scope.error = 'Test is not selected';
        }
        $scope.active.image_test = $scope.tests[$scope.selected_data.image_test];
    };
    $scope.select_edit_quest = function () {
        if (!$scope.selected_data.edit_quest) {
            $scope.error = 'Question is not selected';
        }
        $scope.active.edit_quest = $scope.questions[$scope.selected_data.edit_quest];
        $scope.active.edit_quest.true_answer = String($scope.active.edit_quest.true_answer);
        $scope.active.edit_quest.complexity = String($scope.active.edit_quest.complexity);
        $scope.allow_code.edit = Boolean($scope.active.edit_quest.code);
    };
    $scope.send_edit_test = function () {
        $http({
            method: 'POST',
            url: '/api/edit-test',
            data: $scope.active.edit_test
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.message = 'Success!';
                $scope.error = null;
                $scope.active.edit_test = null;
            }
            else {
                $scope.error = response.body;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
    $scope.send_create_quest = function () {
        if ($scope.active.new_question.$invalid) {
            $scope.error = 'Required fields are empty!'
            return false;
        }
        if (!$scope.allow_code.create) {
            $scope.question_data.code = null;
        }
        $http({
            method: 'POST',
            url: '/api/add-quest',
            data: $scope.question_data
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.message = 'Success!';
                $scope.error = null;
                $scope.question_data = {};
            }
            else {
                $scope.error = response.body;
                $scope.message = null;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
    $scope.send_edit_quest = function () {
        if ($scope.active.edit_question.$invalid) {
            $scope.error = 'Required fields are empty!'
            return false;
        }
        if (!$scope.allow_code.edit) {
            $scope.active.edit_quest.code = null;
        }
        $http({
            method: 'POST',
            url: '/api/edit-quest',
            data: $scope.active.edit_quest
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.message = 'Success!';
                $scope.error = null;
                $scope.question_data = {};
            }
            else {
                $scope.error = response.body;
                $scope.message = null;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };

    // Request for tests and questions
    $http({
        method: 'GET',
        url: '/api/all-tests'
    }).then(function (response) {
        response = response.data;
        if (response.status == 0) {
            $scope.tests = response.body;
        }
        else {
            $scope.error = response.body;
        }
    }).catch(function (err) {
        console.log(err);
        $scope.error = 'Server error';
    });
    $http({
        method: 'GET',
        url: '/api/all-questions'
    }).then(function (response) {
        response = response.data;
        if (response.status == 0) {
            $scope.questions = response.body;
        }
        else {
            $scope.error = response.body;
        }
    }).catch(function (err) {
        console.log(err);
        $scope.error = 'Server error';
    });
}
