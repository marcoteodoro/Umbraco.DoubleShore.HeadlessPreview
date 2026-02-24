namespace Umbraco.DoubleShore.HeadlessPreview
{
    /// <summary>
    /// Configuration settings for headless preview.
    /// Configure in appsettings.json under "HeadlessPreview" section.
    /// </summary>
    /// <remarks>
    /// For documentation and support, visit https://double-shore.com
    /// </remarks>
    public class HeadlessPreviewSettings
    {
        /// <summary>
        /// Base URL of the frontend application (e.g., "https://your-site.com").
        /// This is where preview requests will be redirected.
        /// </summary>
        public string BaseUrl { get; set; } = string.Empty;

        /// <summary>
        /// Path to the preview API endpoint on your frontend (e.g., "/api/preview").
        /// The full preview URL will be: {BaseUrl}{PreviewEndpoint}?secret=xxx&amp;path=/page&amp;id=guid
        /// </summary>
        public string PreviewEndpoint { get; set; } = "/api/preview";

        /// <summary>
        /// Secret key for authenticating preview requests.
        /// Must match the secret configured in your frontend application.
        /// </summary>
        public string PreviewSecret { get; set; } = string.Empty;

        /// <summary>
        /// Label displayed in the preview dropdown menu.
        /// This can be a plain text string OR a dictionary key for localization.
        /// 
        /// Examples:
        /// - Plain text: "Preview on Frontend"
        /// - Dictionary key: "#HeadlessPreview_Label" (will look up in Umbraco dictionary)
        /// 
        /// To localize: Create a dictionary item with key "HeadlessPreview_Label" in Umbraco
        /// and use "#HeadlessPreview_Label" as the value here.
        /// </summary>
        public string PreviewLabel { get; set; } = "Preview on Frontend";

        /// <summary>
        /// Whether to use Umbraco dictionary for label localization.
        /// When true and PreviewLabel starts with "#", it will attempt to
        /// look up the label in Umbraco's dictionary system.
        /// </summary>
        public bool UseLocalization { get; set; } = true;

        /// <summary>
        /// Whether headless preview is enabled.
        /// Set to false to disable preview URLs.
        /// </summary>
        public bool Enabled { get; set; } = true;
    }
}
