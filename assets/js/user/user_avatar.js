$(function() {
    var layer = layui.layer;
    //  获取裁剪区域的 DOM 元素
    var $image = $('#image')
        //  配置选项
    const options = {
            // 纵横比
            aspectRatio: 1 / 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 创建裁剪区域
    $image.cropper(options)


    //点击上传选择图片
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });

    // 文件选择绑定事件，来监听是否上传了图片
    $('#file').on('change', function(e) {
        // 获取上传的图片
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择要上传的图片');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 为确定按钮绑定事件
    $('#btnUpload').on('click', function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //将图片上传服务器，并且调用父窗口的方法重新渲染头像
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败');
                }
                layer.msg('更换头像成功');
                // 调用父页面的方法重新渲染头像
                window.parent.getUserInfo();
            }
        });



    });
























});