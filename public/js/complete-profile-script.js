document.addEventListener("DOMContentLoaded", () => {

    const skillForm = document.getElementById("skillForm");
    const submitBtn = document.getElementById("submitSkillBtn");
    const experience = document.getElementById("experience");

    if (!skillForm) return;


    // Experience validation
    experience.addEventListener("input", () => {

        if (experience.value < 0) {
            experience.value = 0;
        }

        if (experience.value > 100) {
            experience.value = 100;
        }
    });


    // Form submit
    skillForm.addEventListener("submit", (event) => {

        // const selectedType =
        //     document.querySelector(
        //         'input[name="type"]:checked'
        //     );

        const level =
            document.getElementById("level").value;

        const experienceValue =
            experience.value;


        // Type validation
        // if (!selectedType) {
        //     event.preventDefault();

        //     alert("Please select whether you want to teach or learn this skill.");

        //     return;
        // }


        // Level validation
        if (!level) {
            event.preventDefault();

            alert("Please select your skill level.");

            return;
        }


        // Experience validation
        if (
            experienceValue === "" ||
            experienceValue < 0
        ) {
            event.preventDefault();

            alert("Please enter a valid experience.");

            return;
        }


        // Prevent double submission
        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
            ></span>
            Adding Skill...
        `;
    });


    // Automatically highlight selected Teach/Learn card

    const typeOptions =
        document.querySelectorAll(
            '.skill-type-option input'
        );

    typeOptions.forEach((option) => {

        option.addEventListener("change", () => {

            typeOptions.forEach((item) => {
                item.parentElement.classList.remove("selected");
            });

            option.parentElement.classList.add("selected");
        });

    });

});