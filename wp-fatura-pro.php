<?php
/**
 * Plugin Name: WP Fatura Pro (React)
 * Description: React tabanlı, gelişmiş fatura oluşturma ve PDF alma eklentisi.
 * Version: 1.0.0
 * Author: Taner Eren
 * Text Domain: wp-fatura-pro
 */

if (!defined('ABSPATH')) {
    exit;
}

add_shortcode('fatura_araci', 'wfp_render_react_app');

function wfp_render_react_app() {
    return '<div id="root" style="min-height: 800px;">Uygulama Yükleniyor...</div>';
}

add_action('wp_enqueue_scripts', 'wfp_load_react_scripts');

function wfp_load_react_scripts() {
    global $post;
    if (!$post || !has_shortcode($post->post_content, 'fatura_araci')) {
        return;
    }

    $plugin_dir = plugin_dir_path(__FILE__);
    $plugin_url = plugin_dir_url(__FILE__);

    $js_files = glob($plugin_dir . 'frontend/dist/assets/*.js');
    $css_files = glob($plugin_dir . 'frontend/dist/assets/*.css');

    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script(
            'wfp-react-js', 
            $plugin_url . 'frontend/dist/assets/' . $js_file, 
            array(), 
            '1.0.0', 
            true 
        );
    }

    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style(
            'wfp-react-css', 
            $plugin_url . 'frontend/dist/assets/' . $css_file,
            array(),
            '1.0.0'
        );
    }
}

add_filter('script_loader_tag', 'wfp_add_type_attribute', 10, 3);

function wfp_add_type_attribute($tag, $handle, $src) {
    if ('wfp-react-js' !== $handle) {
        return $tag;
    }
    return '<script type="module" src="' . esc_url($src) . '"></script>';
}
