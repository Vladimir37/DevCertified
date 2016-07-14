export default function navbar ($cookies) {
    return {
        restrict: 'EA',
        controller: 'certificate_render',
        scope: {
            data: '='
        },
        templateUrl: '/src/scripts/ng/views/directives/certificate.html'
    }
}
