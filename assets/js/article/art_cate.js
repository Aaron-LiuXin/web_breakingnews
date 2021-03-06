$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArticleList();
    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    // 弹出层关闭的时候要用这个参数
    var indexAdd = null;
    // 添加类别绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    });

    // 通过代理给form-add绑定submite事件
    // 因为这个表单是动态创建出来的
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                initArticleList();
                layer.msg('新增分类成功');
                // 根据索引去关闭弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 点击编辑
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 出来表单要把点击这行的数据从后台取出来渲染到表单上
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过事件委派给修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败~');
                }
                layer.msg('更新分类数据成功~');
                layer.close(indexEdit);
                initArticleList();
            }
        });

    });

    //通过实践委派给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败~');
                    }
                    layer.msg('删除分类成功~');
                    layer.close(index);
                    initArticleList();
                }
            });
        });
    });


































});