/**
 * Created by GaoWei on 2017/5/5.
 */
/*使用方法：
 wall.flow({
 parentElement:'包裹瀑布流子元素的直接父元素',
 rowNumber:瀑布流行数
 });
 * */
var wall = {
    flow: function (arg) {
        // 首先判断所有子元素宽度总和大于maxWidth时才进行瀑布流排列
        var liArr = $(this.matchingSelector(arg.parentElement)).children();
        var margin = (typeof(arg.margin) == 'number' ? arg.margin : (parseInt(liArr.eq(0).css('margin-right')) || 5));
        var maxWidth = arg.maxWidth || $(this.matchingSelector(arg.parentElement)).width();
        var targetArr = [];
        // 找出每行最后一个元素，以及多出或少出的宽度
        for (var i = 0; i < arg.rowNumber; i++) {
            var arr = [];
            var sumWidth = 0;
            var startIndex = (targetArr[targetArr.length - 1] ? targetArr[targetArr.length - 1].index : 0);
            startIndex = (startIndex == 0 ? 0 : startIndex + 1);
            liArr.each(function (index) {
                if (index >= startIndex) {
                    sumWidth += $(this).width();
                    arr.push({
                        index: index,
                        dValue: Math.abs(sumWidth - maxWidth),
                        rValue: sumWidth - maxWidth
                    });
                }
            });
            targetArr.push(getMin(arr));
        }
        //console.log(targetArr[0], targetArr[1], targetArr[2]);
        // 找出最小值函数
        function getMin(arr) {
            var min = arr[0];
            var len = arr.length;
            for (var i = 1; i < len; i++) {
                if (arr[i].dValue < min.dValue) {
                    min = arr[i];
                }
            }
            return min;
        }

        // 遍历参与瀑布流排版的元素，对每一行的每个元素进行精确控制
        for (var i = 0; i < targetArr.length; i++) {
            if (targetArr[i]) {
                var prevIndex = targetArr[i - 1] == undefined ? -1 : targetArr[i - 1].index
                var num = targetArr[i].index - prevIndex;
                if (targetArr[i].index - prevIndex >= 4) { //只有当至少有四张图片时才进行排版
                    liArr.each(function (index) {
                        if (index <= targetArr[i].index && index > prevIndex) {
                            if (targetArr[i].rValue >= 0) {
                                var average = (targetArr[i].dValue + (num - 1) * margin) / num;
                                $(this).width($(this).width() - average).find('img').width('100%');
                            } else if (targetArr[i].rValue < 0) {
                                var average = (targetArr[i].dValue - (num - 1) * margin) / num;
                                $(this).width($(this).width() + average).find('img').width('100%');
                            }
                            if (index == targetArr[i].index) {
                                $(this).css('margin-right', 0);
                            }
                        }
                    });
                }
            }

        }
    },
    matchingSelector: function (selector) { // 传进来的nav元素盒子进行选择器适配
        selector = $.trim(selector);
        if (selector.slice(0, 1) == '.' || selector.slice(0, 1) == '#') {
            selector = selector;
        } else if ($('#' + selector).length > 0) {
            selector = '#' + selector;
        } else if ($('.' + selector).length > 0) {
            selector = '.' + selector;
        }
        return selector;
    }
};