﻿using GZCTF.Models.Internal;

namespace GZCTF.Models.Request.Info;

/// <summary>
/// 验证码配置
/// </summary>
public class ClientCaptchaInfoModel
{
    /// <summary>
    /// 验证码类型
    /// </summary>
    public CaptchaProvider Type { get; set; } = CaptchaProvider.None;

    /// <summary>
    /// 客户端密钥
    /// </summary>
    public string SiteKey { get; set; } = string.Empty;


    public ClientCaptchaInfoModel() { }
    public ClientCaptchaInfoModel(CaptchaConfig? config)
    {
        if (config?.SiteKey is null || config.Provider == CaptchaProvider.None)
            return;

        Type = config.Provider;
        SiteKey = config.SiteKey;
    }
}

