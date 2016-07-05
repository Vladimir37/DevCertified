export default function test_card () {
    return {
        restrict: 'EA',
        controller() {
            console.log('LOAD');
        },
        scope: {},
        template: '<h1>QWE</h1>'
        // templateUrl: '/src/scripts/ng/views/directives/text_card.html'
    }
}
