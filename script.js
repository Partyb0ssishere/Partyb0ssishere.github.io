(function() {
    // 获取 DOM 元素
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    const progressPercent = document.getElementById('progressPercent');
    const slider = document.getElementById('progressSlider');
    const sliderValueDisplay = document.getElementById('sliderValue');
    const btnReset = document.getElementById('btnReset');

    // 默认配置
    const DEFAULT_CURRENT = 0;
    const DEFAULT_MAX = 100;

    /**
     * 更新进度条
     * @param {number} currentValue - 当前进度值（即"最小值"）
     * @param {number} maxValue     - 最大值
     */
    function updateProgress(currentValue, maxValue) {
        // 确保值在合理范围内
        const clampedCurrent = Math.max(0, Math.min(currentValue, maxValue));
        const safeMax = maxValue > 0 ? maxValue : 1;

        // 计算百分比（保留两位小数）
        const percent = (clampedCurrent / safeMax) * 100;
        const percentFormatted = percent.toFixed(2);

        // 更新 CSS 变量 → 驱动填充条宽度
        progressBar.style.setProperty('--progress-current', clampedCurrent);
        progressBar.style.setProperty('--progress-max', safeMax);

        // 判断是否接近满值（用于填充条右端圆角）
        if (percent >= 99.5) {
            progressFill.classList.add('full');
        } else {
            progressFill.classList.remove('full');
        }

        // 更新进度条上的文字：格式为"（当前值）/（最大值）"
        // 使用中文全角括号，与用户要求的格式一致
        progressLabel.textContent = `${clampedCurrent} / ${safeMax}`;

        // 更新右侧百分比
        progressPercent.textContent = `${percentFormatted}%`;

        return { clampedCurrent, safeMax, percent, percentFormatted };
    }

    /**
     * 从 CSS 变量读取当前值
     */
    function readCSSVariables() {
        const computedStyle = getComputedStyle(progressBar);
        const current = parseFloat(computedStyle.getPropertyValue('--progress-current').trim()) ||
        DEFAULT_CURRENT;
        const max = parseFloat(computedStyle.getPropertyValue('--progress-max').trim()) || DEFAULT_MAX;
        return { current, max };
    }

    // 初始化：应用默认值
    const init = readCSSVariables();
    updateProgress(init.current, init.max);
    slider.value = init.current;
    slider.max = init.max;
    sliderValueDisplay.textContent = init.current;

    // 滑块事件监听
    slider.addEventListener('input', function() {
        const val = parseFloat(this.value);
        const { max } = readCSSVariables();
        sliderValueDisplay.textContent = val;
        updateProgress(val, max);
    });

    // 重置按钮
    btnReset.addEventListener('click', function() {
        const { max } = readCSSVariables();
        slider.value = DEFAULT_CURRENT;
        sliderValueDisplay.textContent = DEFAULT_CURRENT;
        updateProgress(DEFAULT_CURRENT, max);
    });

    // ========== 暴露 API 到全局（方便在其他脚本中调用） ==========
    window.ProgressBarAPI = {
        /**
         * 设置进度
         * @param {number} currentValue - 当前进度值
         * @param {number} [maxValue]   - 最大值（可选，不传则保持原最大值）
         * @example
         *   ProgressBarAPI.setProgress(25);        // 设置当前值为25
         *   ProgressBarAPI.setProgress(50, 200);   // 设置当前值为50，最大值为200
         */
        setProgress: function(currentValue, maxValue) {
            const { max: currentMax } = readCSSVariables();
            const newMax = maxValue !== undefined ? maxValue : currentMax;
            // 同时更新滑块
            slider.max = newMax;
            slider.value = Math.min(currentValue, newMax);
            sliderValueDisplay.textContent = currentValue;
            return updateProgress(currentValue, newMax);
        },

        /**
         * 获取当前进度状态
         * @returns {{ current: number, max: number, percent: string }}
         */
        getProgress: function() {
            const { current, max } = readCSSVariables();
            const percent = ((current / (max > 0 ? max : 1)) * 100).toFixed(2);
            return { current, max, percent: percent + '%' };
        },

        /**
         * 重置进度为默认值
         */
        reset: function() {
            slider.value = DEFAULT_CURRENT;
            slider.max = DEFAULT_MAX;
            sliderValueDisplay.textContent = DEFAULT_CURRENT;
            return updateProgress(DEFAULT_CURRENT, DEFAULT_MAX);
        },

        /**
         * 更新最大值
         * @param {number} newMax - 新的最大值
         */
        setMax: function(newMax) {
            const { current } = readCSSVariables();
            slider.max = newMax;
            const newCurrent = Math.min(current, newMax);
            slider.value = newCurrent;
            sliderValueDisplay.textContent = newCurrent;
            return updateProgress(newCurrent, newMax);
        },
    };

    // 控制台输出使用说明
    console.log(
        '%c✅ 进度条组件已就绪 %c| %c使用方法：%cProgressBarAPI.setProgress(当前值, 最大值?)%c\n' +
        '%c   示例：%cProgressBarAPI.setProgress(25)%c // 设置进度为25\n' +
        '%c   示例：%cProgressBarAPI.setProgress(50, 200)%c // 设置进度为50/200\n' +
        '%c   查看：%cProgressBarAPI.getProgress()%c // 获取当前状态\n' +
        '%c   重置：%cProgressBarAPI.reset()%c // 恢复默认',
                'background:#22c55e;color:#000;padding:2px 6px;border-radius:3px;',
                '',
                'color:#888;',
                'color:#fff;font-weight:bold;',
                'color:#888;',
                '',
                'color:#fff;font-weight:bold;',
                'color:#888;',
                '',
                'color:#fff;font-weight:bold;',
                'color:#888;',
                '',
                'color:#fff;font-weight:bold;',
                'color:#888;',
                '',
                'color:#fff;font-weight:bold;',
                'color:#888;'
    );
})();
