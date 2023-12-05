import { defs, tiny } from './examples/common.js';
import { Text_Line } from './examples/text-demo.js';
import { Shape_From_File } from './examples/obj-file-demo.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

export class Miffy extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.shapes = {
            // text
            text: new Text_Line(35),
            // miffy
            miffy: new Shape_From_File("assets/miffy.obj"),
            // sky
            sky: new defs.Cube,
            // ground
            grass: new defs.Cube,
            // sun
            sun: new defs.Subdivision_Sphere(4),
            // house
            house_top: new defs.Triangle,
            house_bottom: new defs.Square,
        }

        this.materials = {
            text_image: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: 0, specularity: 0, texture: new Texture("assets/text.png")}),
            miffy: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 0, color: hex_color("#FFFFFF")}),
            sky: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#29c5f6")}),
            grass: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#388004")}),
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#ffd300")}),
            house_top: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#d0312d")}),
            house_bottom: new Material(new defs.Phong_Shader(),
                {ambient: 1, color: hex_color("#fff8e7")}),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));

        // identity matrix
        this.model_transform = Mat4.identity();
    }

    make_control_panel() {
        // set control panel
    }

    draw_background(context, program_state) {
        let sky_transform = this.model_transform.times(Mat4.scale(2, 2, 0))
            .times(Mat4.translation(0, 0.75, -6));
        this.shapes.sky.draw(context, program_state, sky_transform, this.materials.sky);

        let grass_transform = this.model_transform.times(Mat4.scale(2, 2, 0))
            .times(Mat4.translation(0, 0, -4));
        this.shapes.grass.draw(context, program_state, grass_transform, this.materials.grass);

        let sun_transform = this.model_transform.times(Mat4.scale(0.1, 0.15, 0.3))
            .times(Mat4.translation(6, 4, -2));
        this.shapes.sun.draw(context, program_state, sun_transform, this.materials.sun);
    }

    draw_title(context, program_state) {
        let text_transform = this.model_transform.times(Mat4.scale(0.06,0.06,0.06))
            .times(Mat4.translation(-10, 0.4, -1));
        this.shapes.text.set_string("miffy's big day", context.context);
        this.shapes.text.draw(context, program_state, text_transform, this.materials.text_image);
    }

    draw_house(context, program_state) {
        let house_top_transform = this.model_transform
                                                      .times(Mat4.scale(0.5, 0.8, 0))
                                                      .times(Mat4.translation(0, 0.89, -2))
                                                      .times(Mat4.rotation(10.21, 0, 0, 1));
        this.shapes.house_top.draw(context, program_state, house_top_transform, this.materials.house_top);
        let house_bottom_transform = this.model_transform
            .times(Mat4.scale(0.35, 0.35, 0))
            .times(Mat4.translation(0, -0.57, -2))
            .times(Mat4.rotation(0, 0, 0, 1));
        this.shapes.house_bottom.draw(context, program_state, house_bottom_transform, this.materials.house_bottom);
    }

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, 0));
        }
        // program_state.projection_transform = Mat4.perspective(
        //     Math.PI / 4, context.width / context.height, 0.5, 1000);

        const t = program_state.animation_time, dt = program_state.animation_delta_time / 1000;
        const time_sec = t / 1000;

        const light_position = vec4(10, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.draw_house(context, program_state);

        // this.draw_background(context, program_state);
        //
        // const title_time = 0;
        // const title_time_end = 8;
        // if (time_sec > title_time && time_sec < title_time_end) {
        //     this.draw_title(context, program_state);
        // }

    }
}

