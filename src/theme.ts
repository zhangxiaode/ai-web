export const customTheme: any = {
    dark: {
        common: {
            baseColor: "#fff",
            primaryColor: "#d03050",              // 主色调（主题色）
            primaryColorHover: "#e65372",        // 主色悬停态（亮度+10%，饱和度+5%）
            primaryColorPressed: "#b71737",       // 主色按压态（亮度-10%）
            primaryColorSuppl: "rgb(208, 48, 80)", // 主色补充色（接近主题色）
            textColorBase: "#fff",                // 基础文本色（白色）
            textColor1: "rgba(255, 255, 255, 0.9)", // 主要文本色
            textColor2: "rgba(255, 255, 255, 0.82)", // 次要文本色
            textColor3: "rgba(255, 255, 255, 0.52)", // Placeholder文本色
            textColorDisabled: "rgba(255, 255, 255, 0.38)", // 禁用文本色
            placeholderColor: "rgba(255, 255, 255, 0.38)",
            placeholderColorDisabled: "rgba(255, 255, 255, 0.28)",
            iconColor: "rgba(255, 255, 255, 0.38)",
            iconColorDisabled: "rgba(255, 255, 255, 0.28)",
            iconColorHover: "rgba(255, 255, 255, 0.475)",
            iconColorPressed: "rgba(255, 255, 255, 0.304)",
            dividerColor: "rgba(255, 255, 255, 0.09)",
            borderColor: "rgba(255, 255, 255, 0.24)",
            closeIconColorHover: "rgba(255, 255, 255, 0.52)",
            closeIconColor: "rgba(255, 255, 255, 0.52)",
            closeIconColorPressed: "rgba(255, 255, 255, 0.52)",
            closeColorHover: "rgba(255, 255, 255, 0.12)",
            closeColorPressed: "rgba(255, 255, 255, 0.08)",
            clearColor: "rgba(255, 255, 255, 0.38)",
            clearColorHover: "rgba(255, 255, 255, 0.48)",
            clearColorPressed: "rgba(255, 255, 255, 0.3)",
            scrollbarColor: "rgba(255, 255, 255, 0.2)",
            scrollbarColorHover: "rgba(255, 255, 255, 0.3)",
            progressRailColor: "rgba(255, 255, 255, 0.12)",
            railColor: "rgba(255, 255, 255, 0.2)",
            popoverColor: "rgb(72, 72, 78)",       // 弹出层背景色（深灰色）
            tableColor: "rgb(24, 24, 28)",         // 表格背景色（深色）
            cardColor: "rgb(24, 24, 28)",          // 卡片背景色（深色）
            modalColor: "rgb(44, 44, 50)",         // 模态框背景色（中深色）
            bodyColor: "rgb(16, 16, 20)",          // 页面主体背景色（最深色）
            tagColor: "rgba(51, 51, 51, 1)",       // 标签背景色（深灰色）
            avatarColor: "rgba(255, 255, 255, 0.18)", // 头像背景色（浅白色）
            invertedColor: "#000",                 // 反色（黑色）
            inputColor: "rgba(255, 255, 255, 0.1)",       // 输入框背景色（半透明白色）
            codeColor: "rgba(255, 255, 255, 0.12)",      // 代码块背景色
            tabColor: "rgba(255, 255, 255, 0.04)",       // 标签页背景色
            actionColor: "rgba(255, 255, 255, 0.06)",     // 操作区背景色
            tableHeaderColor: "rgba(255, 255, 255, 0.06)", // 表格表头背景色
            hoverColor: "rgba(255, 255, 255, 0.09)",      // 悬停背景色
            tableColorHover: "rgba(255, 255, 255, 0.06)", // 表格行悬停背景色
            tableColorStriped: "rgba(255, 255, 255, 0.05)", // 表格斑马纹背景色
            pressedColor: "rgba(255, 255, 255, 0.05)",    // 按压背景色
            opacityDisabled: 0.38,
            inputColorDisabled: "rgba(255, 255, 255, 0.06)",
            buttonColor2: "rgba(255, 255, 255, 0.08)",    // 二级按钮背景色
            buttonColor2Hover: "rgba(255, 255, 255, 0.12)", // 二级按钮悬停色
            buttonColor2Pressed: "rgba(255, 255, 255, 0.08)", // 二级按钮按压色
            boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, 0.24), 0 3px 6px 0 rgba(0, 0, 0, 0.18), 0 5px 12px 4px rgba(0, 0, 0, 0.12)",
            boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, 0.24), 0 6px 12px 0 rgba(0, 0, 0, 0.16), 0 9px 18px 8px rgba(0, 0, 0, 0.10)",
            boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03)"
            
            // baseColor: "#fff",
            // primaryColor: "#53d8fe",           // 主色调（蓝色主题色）
            // primaryColorHover: "#7ce2ff",        // 悬停态（亮度+15%）
            // primaryColorPressed: "#2acffd",        // 按压态（亮度-10%）
            // primaryColorSuppl: "#a1edff",      // 补充色（同主色）
            // textColorBase: "#fff",                 // 基础文本色（白色）
            // textColor1: "rgba(255, 255, 255, 0.9)", // 主要文本色
            // textColor2: "rgba(255, 255, 255, 0.82)", // 次要文本色
            // textColor3: "rgba(255, 255, 255, 0.52)", // 占位符文本色
            // textColorDisabled: "rgba(255, 255, 255, 0.38)", // 禁用文本色
            // placeholderColor: "rgba(255, 255, 255, 0.38)",
            // placeholderColorDisabled: "rgba(255, 255, 255, 0.28)",
            // iconColor: "rgba(255, 255, 255, 0.38)",
            // iconColorDisabled: "rgba(255, 255, 255, 0.28)",
            // iconColorHover: "rgba(255, 255, 255, 0.475)",
            // iconColorPressed: "rgba(255, 255, 255, 0.304)",
            // dividerColor: "rgba(255, 255, 255, 0.09)",
            // borderColor: "rgba(255, 255, 255, 0.24)",
            // closeIconColorHover: "rgba(255, 255, 255, 0.52)",
            // closeIconColor: "rgba(255, 255, 255, 0.52)",
            // closeIconColorPressed: "rgba(255, 255, 255, 0.52)",
            // closeColorHover: "rgba(255, 255, 255, 0.12)",
            // closeColorPressed: "rgba(255, 255, 255, 0.08)",
            // clearColor: "rgba(255, 255, 255, 0.38)",
            // clearColorHover: "rgba(255, 255, 255, 0.48)",
            // clearColorPressed: "rgba(255, 255, 255, 0.3)",
            // scrollbarColor: "rgba(255, 255, 255, 0.2)",
            // scrollbarColorHover: "rgba(255, 255, 255, 0.3)",
            // progressRailColor: "rgba(255, 255, 255, 0.12)",
            // railColor: "rgba(255, 255, 255, 0.2)",
            // popoverColor: "rgb(72, 72, 78)",       // 弹出层背景（深灰）
            // tableColor: "rgb(24, 24, 28)",         // 表格背景（深色）
            // cardColor: "rgb(24, 24, 28)",          // 卡片背景（深色）
            // modalColor: "rgb(44, 44, 50)",         // 模态框背景（中深色）
            // bodyColor: "rgb(16, 16, 20)",          // 主体背景（最深色）
            // tagColor: "rgba(51, 51, 51, 1)",       // 标签背景（深灰）
            // avatarColor: "rgba(255, 255, 255, 0.18)", // 头像背景（浅白）
            // invertedColor: "#000",                 // 反色（黑色）
            // inputColor: "rgba(255, 255, 255, 0.1)",       // 输入框背景（半透明白）
            // codeColor: "rgba(255, 255, 255, 0.12)",      // 代码块背景
            // tabColor: "rgba(255, 255, 255, 0.04)",       // 标签页背景
            // actionColor: "rgba(255, 255, 255, 0.06)",     // 操作区背景
            // tableHeaderColor: "rgba(255, 255, 0, 0.06)", // 表格表头背景
            // hoverColor: "rgba(255, 255, 255, 0.09)",      // 悬停背景
            // tableColorHover: "rgba(255, 255, 255, 0.06)", // 表格行悬停背景
            // tableColorStriped: "rgba(255, 255, 255, 0.05)", // 斑马纹背景
            // pressedColor: "rgba(255, 255, 255, 0.05)",    // 按压背景
            // opacityDisabled: 0.38,
            // inputColorDisabled: "rgba(255, 255, 255, 0.06)",
            // buttonColor2: "rgba(255, 255, 255, 0.08)",    // 二级按钮背景
            // buttonColor2Hover: "rgba(255, 255, 255, 0.12)", // 二级按钮悬停
            // buttonColor2Pressed: "rgba(255, 255, 255, 0.08)", // 二级按钮按压
            // boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, 0.24), 0 3px 6px 0 rgba(0, 0, 0, 0.18), 0 5px 12px 4px rgba(0, 0, 0, 0.12)",
            // boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, 0.24), 0 6px 12px 0 rgba(0, 0, 0, 0.16), 0 9px 18px 8px rgba(0, 0, 0, 0.10)",
            // boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03)"
        }
    },
    light: {
        common: {
            // baseColor: "#FFF",
            // primaryColor: "#cd4a7b",
            // primaryColorHover: "#e06a94",
            // primaryColorPressed: "#b03a66",
            // primaryColorSuppl: "#e06a94",
            // textColorBase: "#000",
            // textColor1: "rgb(31, 34, 37)",
            // textColor2: "rgb(51, 54, 57)",
            // textColor3: "rgb(118, 124, 130)",
            // textColorDisabled: "rgba(194, 194, 194, 1)",
            // placeholderColor: "rgba(194, 194, 194, 1)",
            // placeholderColorDisabled: "rgba(209, 209, 209, 1)",
            // iconColor: "rgba(194, 194, 194, 1)",
            // iconColorHover: "rgba(146, 146, 146, 1)",
            // iconColorPressed: "rgba(175, 175, 175, 1)",
            // iconColorDisabled: "rgba(209, 209, 209, 1)",
            // dividerColor: "rgb(239, 239, 245)",
            // borderColor: "rgb(224, 224, 230)",
            // closeIconColor: "rgba(102, 102, 102, 1)",
            // closeIconColorHover: "rgba(102, 102, 102, 1)",
            // closeIconColorPressed: "rgba(102, 102, 102, 1)",
            // closeColorHover: "rgba(0, 0, 0, .09)",
            // closeColorPressed: "rgba(0, 0, 0, .13)",
            // clearColor: "rgba(194, 194, 194, 1)",
            // clearColorHover: "rgba(146, 146, 146, 1)",
            // clearColorPressed: "rgba(175, 175, 175, 1)",
            // scrollbarColor: "rgba(0, 0, 0, 0.25)",
            // scrollbarColorHover: "rgba(0, 0, 0, 0.4)",
            // progressRailColor: "rgba(235, 235, 235, 1)",
            // railColor: "rgb(219, 219, 223)",
            // popoverColor: "#fff",
            // tableColor: "#fff",
            // cardColor: "#fff",
            // modalColor: "#fff",
            // bodyColor: "#fff",
            // tagColor: "#eee",
            // avatarColor: "rgba(204, 204, 204, 1)",
            // invertedColor: "rgb(0, 20, 40)",
            // inputColor: "rgba(255, 255, 255, 1)",
            // codeColor: "rgb(244, 244, 248)",
            // tabColor: "rgb(247, 247, 250)",
            // actionColor: "rgb(250, 250, 252)",
            // tableHeaderColor: "rgb(250, 250, 252)",
            // hoverColor: "rgb(243, 243, 245)",
            // tableColorHover: "rgba(0, 0, 100, 0.03)",
            // tableColorStriped: "rgba(0, 0, 100, 0.02)",
            // pressedColor: "rgb(237, 237, 239)",
            // opacityDisabled: 0.5,
            // inputColorDisabled: "rgb(250, 250, 252)",
            // buttonColor2: "rgba(46, 51, 56, .05)",
            // buttonColor2Hover: "rgba(46, 51, 56, .09)",
            // buttonColor2Pressed: "rgba(46, 51, 56, .13)",
            // boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
            // boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
            // boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
    
            baseColor: "#FFF",
            primaryColor: "#6d28d9",                // 主色调（蓝色主题色）
            primaryColorHover: "#66b1ff",          // 悬停态（亮度+15%）
            primaryColorPressed: "#3a8ee6",        // 按压态（亮度-10%）
            primaryColorSuppl: "#66b1ff",          // 补充色（同悬停态，增强层次感）
            textColorBase: "#000",                 // 基础文本色（黑色）
            textColor1: "rgb(31, 34, 37)",         // 主要文本色
            textColor2: "rgb(51, 54, 57)",         // 次要文本色
            textColor3: "rgb(118, 124, 130)",      // 辅助文本色
            textColorDisabled: "rgba(194, 194, 194, 1)", // 禁用文本色
            placeholderColor: "rgba(194, 194, 194, 1)",
            placeholderColorDisabled: "rgba(209, 209, 209, 1)",
            iconColor: "rgba(194, 194, 194, 1)",   // 图标颜色
            iconColorHover: "rgba(146, 146, 146, 1)", // 图标悬停色
            iconColorPressed: "rgba(175, 175, 175, 1)", // 图标按压色
            iconColorDisabled: "rgba(209, 209, 209, 1)",
            dividerColor: "rgb(239, 239, 245)",    // 分隔线颜色
            borderColor: "rgb(224, 224, 230)",     // 边框颜色
            closeIconColor: "rgba(102, 102, 102, 1)", // 关闭图标颜色
            closeIconColorHover: "rgba(102, 102, 102, 1)",
            closeIconColorPressed: "rgba(102, 102, 102, 1)",
            closeColorHover: "rgba(0, 0, 0, .09)", // 关闭按钮悬停背景
            closeColorPressed: "rgba(0, 0, 0, .13)", // 关闭按钮按压背景
            clearColor: "rgba(194, 194, 194, 1)",  // 清除按钮颜色
            clearColorHover: "rgba(146, 146, 146, 1)",
            clearColorPressed: "rgba(175, 175, 175, 1)",
            scrollbarColor: "rgba(0, 0, 0, 0.25)", // 滚动条颜色
            scrollbarColorHover: "rgba(0, 0, 0, 0.4)",
            progressRailColor: "rgba(235, 235, 235, 1)", // 进度条轨道颜色
            railColor: "rgb(219, 219, 223)",            // 轨道颜色
            popoverColor: "#fff",                      // 弹出层背景色
            tableColor: "#fff",                        // 表格背景色
            cardColor: "#fff",                         // 卡片背景色
            modalColor: "#fff",                        // 模态框背景色
            bodyColor: "#fff",                         // 页面主体背景色
            tagColor: "#eee",                          // 标签背景色
            avatarColor: "rgba(204, 204, 204, 1)",     // 头像背景色
            invertedColor: "rgb(0, 20, 40)",           // 反色
            inputColor: "rgba(255, 255, 255, 1)",      // 输入框背景色
            codeColor: "rgb(244, 244, 248)",           // 代码块背景色
            tabColor: "rgb(247, 247, 250)",            // 标签页背景色
            actionColor: "rgb(250, 250, 252)",         // 操作区背景色
            tableHeaderColor: "rgb(250, 250, 252)",    // 表格表头背景色
            hoverColor: "rgb(243, 243, 245)",         // 悬停背景色
            tableColorHover: "rgba(64, 158, 255, 0.03)", // 表格行悬停背景色（蓝色调）
            tableColorStriped: "rgba(64, 158, 255, 0.02)", // 表格斑马纹背景色
            pressedColor: "rgb(237, 237, 239)",       // 按压背景色
            opacityDisabled: 0.5,
            inputColorDisabled: "rgb(250, 250, 252)", // 禁用输入框背景色
            buttonColor2: "rgba(46, 51, 56, .05)",    // 二级按钮背景色
            buttonColor2Hover: "rgba(46, 51, 56, .09)", // 二级按钮悬停色
            buttonColor2Pressed: "rgba(46, 51, 56, .13)", // 二级按钮按压色
            boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
            boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
            boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
        }
    }
}