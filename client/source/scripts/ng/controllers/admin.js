export default function($scope, $http) {
    $scope.selected_data = {};
    $scope.question_data = {};
    $scope.active = {};
    $scope.allow_code = {
        create: false,
        edit: false
    };
    $scope.reports = {
        type: 0
    };
    $scope.select_edit_test = function () {
        if (!$scope.selected_data.edit_test) {
            $scope.error = 'Test is not selected';
            return false;
        }
        $scope.active.edit_test = $scope.tests[$scope.selected_data.edit_test];
        $scope.active.edit_test.subjects = $scope.active.edit_test.subjects.join('|');
    };
    $scope.select_image_test = function () {
        if (!$scope.selected_data.image_test) {
            $scope.error = 'Test is not selected';
            return false;
        }
        $scope.active.image_test = $scope.tests[$scope.selected_data.image_test];
    };
    $scope.select_edit_quest = function () {
        if (!$scope.selected_data.edit_quest) {
            $scope.error = 'Question is not selected';
            return false;
        }
        $scope.active.edit_quest = $scope.questions[$scope.selected_data.edit_quest];
        $scope.active.edit_quest.true_answer = String($scope.active.edit_quest.true_answer);
        $scope.active.edit_quest.complexity = String($scope.active.edit_quest.complexity);
        $scope.allow_code.edit = Boolean($scope.active.edit_quest.code);
    };
    $scope.select_delete_quest = function () {
        if (!$scope.selected_data.delete_quest) {
            $scope.error = 'Question is not selected';
            return false;
        }
        $scope.active.delete_quest = $scope.questions[$scope.selected_data.delete_quest];
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
    $scope.send_delete_quest = function () {
        if ($scope.active.delete_question) {
            $scope.error = 'Required fields are empty!'
            return false;
        }
        $http({
            method: 'POST',
            url: '/api/delete-quest',
            data: $scope.active.delete_quest
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.message = 'Success!';
                $scope.error = null;
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
    $scope.select_report_type = function () {
        $http({
            method: 'GET',
            url: '/api/get-reports',
            params: {
                type: $scope.reports.type
            }
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.reports.list = response.body;
            }
            else {
                $scope.error = response.body;
            }
        }).catch(function (err) {
            console.log(err);
            $scope.error = 'Server error';
        });
    };
    $scope.resolve_report = function (id) {
        $http({
            method: 'POST',
            url: '/api/solve-report',
            data: {
                report: id
            }
        }).then(function (response) {
            response = response.data;
            if (response.status == 0) {
                $scope.reports.list = null;
            }
            else {
                $scope.error = response.body;
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
    $http({
        method: 'GET',
        url: '/api/get-questions-col'
    }).then(function (response) {
        response = response.data;
        if (response.status == 0) {
            $scope.questions_cols = response.body;
        }
        else {
            $scope.error = response.body;
        }
    }).catch(function (err) {
        console.log(err);
        $scope.error = 'Server error';
    });
}
