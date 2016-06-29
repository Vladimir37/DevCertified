export default function navbar ($cookies) {
    return {
        status: $cookies.get('dclog'),
        restrict: 'EA',
        controller: 'header',
        scope: false,
        templateUrl() {
            if (this.status) {
                return '/src/scripts/ng/views/menu/user.html';
            }
            else {
                return '/src/scripts/ng/views/menu/guest.html';
            }
        }
    }
}
