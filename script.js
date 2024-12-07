// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const compressSettings = document.getElementById('compressSettings');
const resultContainer = document.getElementById('resultContainer');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalImg = document.getElementById('originalImg');
const compressedImg = document.getElementById('compressedImg');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 上传区域点击事件
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 文件拖拽事件
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
    uploadArea.style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#E5E5E7';
    uploadArea.style.backgroundColor = '#FFFFFF';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#E5E5E7';
    uploadArea.style.backgroundColor = '#FFFFFF';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// 文件选择事件
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

// 质量滑块事件
qualityInput.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalImg.src) {
        compressImage();
    }
});

// 处理上传的图片
function handleImage(file) {
    // 显示压缩设置和结果区域
    compressSettings.hidden = false;
    resultContainer.hidden = false;
    
    // 显示原始图片大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 读取并显示原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImg.src = e.target.result;
        originalImg.onload = () => {
            compressImage();
        };
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = originalImg.naturalWidth;
    canvas.height = originalImg.naturalHeight;
    
    // 绘制图片
    ctx.drawImage(originalImg, 0, 0);
    
    // 压缩图片
    const quality = qualityInput.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // 显示压缩后的图片
    compressedImg.src = compressedDataUrl;
    
    // 计算并显示压缩后的大小
    const compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);
    compressedSize.textContent = formatFileSize(compressedBytes);
    
    // 设置下载按钮
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = `compressed_${Date.now()}.jpg`;
        link.href = compressedDataUrl;
        link.click();
    };
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});