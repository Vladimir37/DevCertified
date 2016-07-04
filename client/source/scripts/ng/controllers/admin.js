export default function($scope, $http) {
    $scope.selected_data = {};
    $scope.active = {};
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
    $scope.send_edit = function () {
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
}
